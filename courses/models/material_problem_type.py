from django.db import models
from django.utils.translation import gettext_lazy as _
from django.contrib.postgres.fields import JSONField

from .material_problem_type_sandbox import MaterialProblemTypeSandbox


class MaterialProblemType(MaterialProblemTypeSandbox):  # MaterialProblemTypeSandbox ~= sanbox data
    # sanbox reverse field (see material_sandbox)
    official = models.BooleanField(default=False)

    class Meta:
        unique_together = []  # reset unique_together from BaseItemModel





