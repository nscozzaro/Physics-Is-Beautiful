"""
Django settings for pib project.

Generated by 'django-admin startproject' using Django 1.10.4.

For more information on this file, see
https://docs.djangoproject.com/en/1.10/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.10/ref/settings/
"""

import os
import sentry_sdk

from sentry_sdk.integrations.django import DjangoIntegration

SENTRY_DSN = os.getenv('RAVEN_DSN')

sentry_sdk.init(
    dsn=SENTRY_DSN,
    integrations=[DjangoIntegration()],
    # If you wish to associate users to errors (assuming you are using
    # django.contrib.auth) you may enable sending PII data.
    send_default_pii=True
)

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

SITE_ID = 1

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.10/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.getenv('DJANGO_SECRET')


AUTHENTICATION_BACKENDS = (
    # Needed to login by username in Django admin, regardless of `allauth`
    'django.contrib.auth.backends.ModelBackend',

    # `allauth` specific authentication methods, such as login by e-mail
    'allauth.account.auth_backends.AuthenticationBackend',
)

# Application definition

INSTALLED_APPS = [
    # 'raven.contrib.django.raven_compat',
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.sitemaps',
    # FTS
    # 'haystack',
    # assets
    'django_s3_storage',
    # For allauth
    'django.contrib.sites',
    'allauth',
    'allauth.account',
    'allauth.socialaccount',
    'allauth.socialaccount.providers.facebook',
    'allauth.socialaccount.providers.google',
    # drf
    'rest_framework',
    'django_filters',
    # webpack
    'webpack_loader',
    # Nested admin
    'nested_admin',
    'django_gravatar',
    'vote',
    'reversion',
    'notifications',
    'admin_reorder',
    'crispy_forms',
    'taggit',
    'taggit_serializer',
    'mptt',
    # pib apps
    'pib_auth.apps.PibAuthConfig',
    'profiles.apps.ProfilesConfig',
    'homepage.apps.HomepageConfig',
    'courses.apps.CoursesConfig',
    'curricula.apps.CurriculaConfig',
    # lib
    'piblib',
    # blog
    'user_reputation.apps.UserReputationConfig',
    'blog',
    'editor',
    'djeddit',
    'badges',
    'meta',
    'classroom',
    'resources',
    'pagedown',
    'markdown_deux',
    'corsheaders'
    # 'moderation.apps.SimpleModerationConfig'
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    # 'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'admin_reorder.middleware.ModelAdminReorder',
    'pib_auth.middleware.LastUserActivityMiddleware'
]

ADMIN_REORDER = (
    # Reorder app models
    {'app': 'courses', 'models': ('courses.Course', 'courses.Unit', 'courses.Module',
                                  'courses.Lesson', 'courses.Material', 'courses.MaterialProblemType',
                                  'courses.JsonDataImage'
                                  )},
    {'app': 'curricula', 'models': ('curricula.Curriculum', 'curricula.Unit', 'curricula.Module',
                                    'curricula.Lesson', 'curricula.Question')},
    'moderation',  'classroom', 'account', 'auth', 'djeddit', 'pib_auth', 'profiles', 'sites', 'socialaccount', 'resources'
)

ROOT_URLCONF = 'pib.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [
            os.path.join(BASE_DIR, 'templates'),
            os.path.join(BASE_DIR, 'templates', 'allauth'),  # not sure that we need it
            os.path.join(BASE_DIR, 'node_modules', '@vermus', 'django-react-djeddit-client', 'dist'),
            os.path.join(BASE_DIR, 'courses', 'sandbox-eval-project', 'www', 'courses', 'js'), # 'codesandbox-apps', 'eval'
        ],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
                # 'django.template.context_processors.request',
                'djeddit.context_processors.djeddit_settings'
            ],
        },
    },
]

WSGI_APPLICATION = 'pib.wsgi.application'


# Database
# https://docs.djangoproject.com/en/1.10/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': os.getenv('DJANGO_DB_TYPE', 'django.db.backends.postgresql_psycopg2'),
        'NAME': os.getenv('DJANGO_DB_NAME', 'pib_production'),
        'USER': os.getenv('DJANGO_DB_USER', 'dbadmin'),
        'HOST': os.getenv('DJANGO_DB_HOST', '127.0.0.1'),
        'PORT': os.getenv('DJANGO_DB_PORT', '5432'),
        'PASSWORD': os.getenv('DJANGO_DB_PASS', ''),

        # 'OPTIONS': {
        #     # Minor hack to allow creation of Djeddit threads
        #     # See https://stackoverflow.com/a/9699805/6609551
        #     "init_command": "SET foreign_key_checks = 0;"
        # }
    }
}


# Password validation
# https://docs.djangoproject.com/en/1.10/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/1.10/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'America/New_York'

USE_I18N = True

USE_L10N = True

USE_TZ = True


AUTH_USER_MODEL = 'pib_auth.User'


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.10/howto/static-files/

STATIC_URL = '/static/'

STATIC_ROOT = os.getenv('DJANGO_STATIC_ROOT')

# We do this so that django's collectstatic copies or our bundles to the
# STATIC_ROOT or syncs them to whatever storage we use.
STATICFILES_DIRS = (
    os.path.join(BASE_DIR, 'static'),
    os.path.join(BASE_DIR, 'courses', 'sandbox-eval-project', 'www'),
)

STATICFILES_FINDERS = [
    # by default
    'django.contrib.staticfiles.finders.FileSystemFinder',
    'django.contrib.staticfiles.finders.AppDirectoriesFinder',
    'npm.finders.NpmFinder'
]

NPM_ROOT_PATH = BASE_DIR
NPM_STATIC_FILES_PREFIX = os.path.join('js', 'npm')
NPM_FILE_PATTERNS = {
    os.path.join('@vermus', 'django-react-djeddit-client'): [os.path.join('dist', '*')]
}

EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
DEFAULT_FROM_EMAIL = 'Physics is Beautiful <no-reply@physicsisbeautiful.com>'
ACCOUNT_USER_MODEL_USERNAME_FIELD = None
ACCOUNT_USERNAME_REQUIRED = False
# ACCOUNT_USERNAME_REQUIRED = True # we don't need unique username, it is auto generate
# ACCOUNT_AUTHENTICATION_METHOD = 'username_email' # we don't username auth
ACCOUNT_AUTHENTICATION_METHOD = 'email'
ACCOUNT_EMAIL_REQUIRED = True
ACCOUNT_UNIQUE_EMAIL = True
ACCOUNT_EMAIL_VERIFICATION = 'mandatory'
ACCOUNT_SIGNUP_FORM_CLASS = 'pib_auth.forms.SignupForm'
ACCOUNT_LOGIN_ON_EMAIL_CONFIRMATION = True
ACCOUNT_CONFIRM_EMAIL_ON_GET = True
SOCIALACCOUNT_EMAIL_VERIFICATION = False
SOCIALACCOUNT_AUTO_SIGNUP = True
SOCIALACCOUNT_ADAPTER = 'pib_auth.adapters.SocialAccountAdapter'

LOGIN_REDIRECT_URL = 'pib_auth:login-next'

USER_LAST_ACTIVITY_INTERVAL_SECS = 120

MEDIA_ROOT = os.getenv('DJANGO_MEDIA_ROOT')
MEDIA_URL = '/media/'

REST_FRAMEWORK = {
    # Use Django's standard `django.contrib.auth` permissions,
    # or allow read-only access for unauthenticated users.
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.DjangoModelPermissionsOrAnonReadOnly'
    ],
    'PAGINATE_BY': 50,
    'DEFAULT_AUTHENTICATION_CLASSES': (
        # 'rest_framework.authentication.BasicAuthentication',
        'rest_framework.authentication.SessionAuthentication',
    ),
    'DEFAULT_FILTER_BACKENDS': ('django_filters.rest_framework.DjangoFilterBackend',)
}

WEBPACK_LOADER = {
    'DEFAULT': {
        'BUNDLE_DIR_NAME': 'js/bundles/',
        'STATS_FILE': os.path.join(BASE_DIR, 'webpack-stats.json'),
    }
}

# HAYSTACK_CONNECTIONS = {
#     'default': {
#         'ENGINE': 'haystack.backends.whoosh_backend.WhooshEngine',
#         'PATH': os.path.join(BASE_DIR, 'whoosh_index'),
#     },
# }

# HAYSTACK_SIGNAL_PROCESSOR = 'haystack.signals.RealtimeSignalProcessor'

REPUTATION_STAGE_1_POINTS = 5
REPUTATION_STAGE_2_POINTS = 10

DJEDDIT_USER_FIELDS = ['display_name', ]
DJEDDIT_DISPLAY_USERNAME_FIELD = 'display_name'

# studyhub-co settings

# We don't want to use Django generic relations due we lose the consistency and integrity of database
# and count of sql queries will be increases
DJEDDIT_RELATED_FIELDS = {
    'textbook_resource': 'textbook_resource',
    'textbook_problem': 'textbook_problem',
    'textbook_solution': 'textbook_solution',
    'course_question': 'course_question',  # curricula TODO remove
    'course_material': 'course_material'
}

DJEDDIT_STATIC_FILES_URL_PREFIX = 'js/npm/@vermus/django-react-djeddit-client/dist'

SYSTEM_USER_ID = 2

# TODO remove after new version will be released
CURRICULA_SQL_PROBLEM_TYPE_HOST = os.getenv('CURRICULA_SQL_PROBLEM_TYPE_HOST')
CURRICULA_SQL_PROBLEM_TYPE_USER = os.getenv('CURRICULA_SQL_PROBLEM_TYPE_USER')
CURRICULA_SQL_PROBLEM_TYPE_USER_PASSWORD = os.getenv('CURRICULA_SQL_PROBLEM_TYPE_USER_PASSWORD')

MYSQL_PROBLEM_TYPE_HOST = os.getenv('MYSQL_PROBLEM_TYPE_HOST')
MYSQL_PROBLEM_TYPE_USER = os.getenv('MYSQL_PROBLEM_TYPE_USER')
MYSQL_PROBLEM_TYPE_USER_PASSWORD = os.getenv('MYSQL_PROBLEM_TYPE_USER_PASSWORD')
