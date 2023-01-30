from django.contrib import admin
from .models import *

# Register your models here.

admin.site.register(User)
admin.site.register(Product_to_hire)
admin.site.register(Hire_category)
admin.site.register(Product_to_buy)
admin.site.register(Buy_category)
