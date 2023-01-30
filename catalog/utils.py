"""Common view for all views on view.py"""
"""Author: Charles Umesi"""

from .models import *

def base(request):
    products_to_hire = Product_to_hire.objects.all()
    hire_categories = Hire_category.objects.all()
    products_to_buy = Product_to_buy.objects.all()
    buy_categories = Buy_category.objects.all()
    customer_ph_ratings = Customer_ph_rating.objects.all().order_by('-date_posted')
    customer_pb_ratings = Customer_pb_rating.objects.all().order_by('-date_posted')
    objects = {
        'products_to_hire' : products_to_hire,
        'hire_categories' : hire_categories,
        'products_to_buy' : products_to_buy,
        'buy_categories' : buy_categories,
        'customer_ph_ratings' : customer_ph_ratings,
        'customer_pb_ratings' : customer_pb_ratings,
    }
    return objects
