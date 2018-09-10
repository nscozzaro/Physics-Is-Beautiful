from __future__ import unicode_literals

from django.apps import AppConfig


class ProfilesConfig(AppConfig):
    name = 'profiles'

    def ready(self):
        from .receivers import create_profile, save_gravatar_url
