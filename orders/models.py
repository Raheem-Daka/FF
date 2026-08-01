from django.conf import settings
from django.db import models
from item.models import Item


class Order(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("processing", "Processing"),
        ("delivered", "Delivered"),
        ("cancelled", "Cancelled"),
    ]

    PAYMENT_CHOICES = [
        ("cod", "Cash on Delivery"),
        ("mobile", "Mobile Money"),
        ("visa", "VISA"),
        ("paypal", "PayPal"),
        ("stripe", "Stripe"),
    ]

    SOURCE_CHOICES = [
        ("website", "Website"),
        ("whatsapp", "WhatsApp"),
        ("facebook", "Facebook"),
        ("instagram", "Instagram"),
        ("walkin", "Walk In"),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="orders"
    )

    full_name = models.CharField(max_length=255)
    phone = models.CharField(max_length=30)
    address = models.TextField()
    city = models.CharField(max_length=100)

    payment_method = models.CharField(
        max_length=20,
        choices=PAYMENT_CHOICES,
        default="cod"
    )

    source = models.CharField(
        max_length=20,
        choices=SOURCE_CHOICES,
        default="website"
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="pending"
    )

    subtotal = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    delivery_fee = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    total = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"Order #{self.id} - {self.user}"


class OrderItem(models.Model):
    order = models.ForeignKey(
        Order,
        related_name="items",
        on_delete=models.CASCADE
    )

    item = models.ForeignKey(
        Item,                 
        on_delete=models.CASCADE
    )

    quantity = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=12, decimal_places=2)
    subtotal = models.DecimalField(max_digits=12, decimal_places=2)

    def __str__(self):
        return f"{self.item} x{self.quantity}"

# Commission & Lead Models
class Commission(models.Model):
    order = models.OneToOneField(
        Order,
        on_delete=models.CASCADE,
        related_name="commission"
    )

    rate = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=5.00
    )

    amount = models.DecimalField(
        max_digits=12,
        decimal_places=2,
        default=0
    )

    paid = models.BooleanField(default=False)
    paid_at = models.DateTimeField(
        null=True,
        blank=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def save(self, *args, **kwargs):
        is_new = self.pk is None

        self.amount = self.order.total * (
            self.rate / Decimal("100")
        )

        if self.paid and not self.paid_at:
            self.paid_at = timezone.now()

        super().save(*args, **kwargs)

        if is_new:
            CommissionAudit.objects.create(
                commission=self,
                action="Commission Created"
            )

    def __str__(self):
        return f"Commission for Order #{self.order.id}"

class CommissionAudit(models.Model):
    commission = models.ForeignKey(
        Commission,
        related_name="audits",
        on_delete=models.CASCADE
    )

    action = models.CharField(
        max_length=100
    )

    notes = models.TextField(
        blank=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def save(self, *args, **kwargs):
        is_new = self.pk is None

        previously_paid = False

        if self.pk:
            previously_paid = (
                Commission.objects
                .get(pk=self.pk)
                .paid
            )

        self.amount = self.order.total * (
            self.rate / Decimal("100")
        )

        if self.paid and not self.paid_at:
            self.paid_at = timezone.now()

        super().save(*args, **kwargs)

        if is_new:
            CommissionAudit.objects.create(
                commission=self,
                action="Commission Created"
            )

        if not previously_paid and self.paid:
            CommissionAudit.objects.create(
                commission=self,
                action="Commission Marked Paid"
            )

    def __str__(self):
        return f"{self.action} - {self.commission.id}"

class Lead(models.Model):
    SOURCE_CHOICES = [
        ("website", "Website"),
        ("facebook", "Facebook"),
        ("instagram", "Instagram"),
    ]

    name = models.CharField(max_length=255)
    phone = models.CharField(max_length=30)
    source = models.CharField(
        max_length=20,
        choices=SOURCE_CHOICES,
        default="website"
    )
    created_at = models.DateTimeField(auto_now_add=True)