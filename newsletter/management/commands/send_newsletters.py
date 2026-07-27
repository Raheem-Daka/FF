from django.core.management.base import BaseCommand
from newsletter.services import send_all_newsletters


class Command(BaseCommand):
    help = "Send newsletters to all subscribers"

    def handle(self, *args, **kwargs):
        send_all_newsletters()
        self.stdout.write(
            self.style.SUCCESS("Newsletters sent successfully")
        )