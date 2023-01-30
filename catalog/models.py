from django.db import models
from django.contrib.auth.models import (
    BaseUserManager, AbstractBaseUser
)
from django.urls import reverse
from PIL import Image, ImageFile
from decimal import *
import datetime

# Create your models here.

# Author: Charles Umesi

# Customer authentication-related classes

class UserManager(BaseUserManager):
    def create_user(self, email, password=None):
        """
        Creates and saves a User with the given email and password.
        """
        if not email:
            raise ValueError('Users must have an email address')

        user = self.model(
            email=self.normalize_email(email),
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_staffuser(self, email, password):
        """
        Creates and saves a staff user with the given email and password.
        """
        user = self.create_user(
            email,
            password=password,
        )
        user.staff = True
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password):
        """
        Creates and saves a superuser with the given email and password.
        """
        user = self.create_user(
            email,
            password=password,
        )
        user.staff = True
        user.admin = True
        user.save(using=self._db)
        return user

# hook in the New Manager to our Model
class User(AbstractBaseUser):

    email = models.EmailField(verbose_name='email address', max_length=255, unique=True, default = 'email')
    name = models.CharField(max_length=255, blank=True, default='Name')
    is_active = models.BooleanField(default=True)
    staff = models.BooleanField(default=False) # a admin user; non super-user
    admin = models.BooleanField(default=False) # a superuser

    # The absent "Password field" is built in.

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = [] # Email & Password are required by default.

    def get_full_name(self):
        # The user is identified by their name or email username
        return self.email.split('@')[0].capitalize() 

    def get_short_name(self):
        # The user is identified by their name or email username
        return self.email.split('@')[0].capitalize()

    def __str__(self):
        return self.email

    def has_perm(self, perm, obj=None):
        "Does the user have a specific permission?"
        # Simplest possible answer: Yes, always
        return True

    def has_module_perms(self, app_label):
        "Does the user have permissions to view the app `app_label`?"
        # Simplest possible answer: Yes, always
        return True

    @property
    def is_staff(self):
        "Is the user a member of staff?"
        return self.staff

    @property
    def is_admin(self):
        "Is the user a admin member?"
        return self.admin

    objects = UserManager()

# Customer-related class

class Customer(models.Model):
    user = models.CharField(max_length=100, default='User')
    name = models.CharField(max_length=250, default='')
    email = models.CharField(max_length=250, default='')
    phone = models.CharField(max_length=250, default='')
    street = models.CharField(max_length=250, default='')
    town = models.CharField(max_length=250, default='Town/City')
    country = models.CharField(max_length=250, default='Country')
    postcode = models.CharField(max_length=250, default='Postcode')
    timestamp = models.DateTimeField(default=datetime.datetime.now())
    transaction_key = models.TextField(default='Transaction Key')
    def __str__(self):
        """Returns a human-readable string for each hire category on the admin site"""
        return self.name

# Product-hiring-related classes

class Hire_category(models.Model):
    group = models.CharField(max_length=200, default='Category')
    description = models.TextField(default='Description of hire category')
    image_for_category = models.FileField(upload_to='images/hire_categories', null=True)
    most_popular = models.CharField(max_length=250, default='')

    class Meta:
        """Pluralises words that require more than just adding 's' to the end of them"""
        verbose_name_plural = "hire categories"

    def __str__(self):
        """Returns a human-readable string for each hire category on the admin site"""
        return self.group

class Product_to_hire(models.Model):

    name = models.CharField(max_length=250, default='Name')
    code = models.CharField(max_length=30, default='H/0000') # The product id you assign to the product (not to be confused with Django's id for the class)
    mode = models.CharField(max_length=30, default='Hire')
    image_1 = models.FileField(upload_to='images/products_to_hire', null=True)
    image_2 = models.FileField(upload_to='images/products_to_hire', null=True)
    image_3 = models.FileField(upload_to='images/products_to_hire', null=True)
    image_4 = models.FileField(upload_to='images/products_to_hire', null=True)
    image_5 = models.FileField(upload_to='images/products_to_hire', null=True)
    description = models.TextField(default='Description of hire product')
    safety = models.FileField(upload_to='', null=True)
    daily_hire_rate = models.DecimalField(max_digits=7, decimal_places=2)
    vat = models.TextField(default='State whether rate includes or excludes VAT')
    mean_rating = models.IntegerField(default=0) # Note: This value is dynamic and is determined by Customer_ph_rating and implemented by views.py
    hire_category = models.ForeignKey(Hire_category, on_delete=models.CASCADE)
    hire_category_accessible = models.TextField(max_length=250, default='State foreign key chosen (Note: Entering this here makes the foreign key text more accessible for html template syntax purposes)')
    special = models.TextField(default='State key exclusions or inclusions with the hire product (for example, are batteries included?)')
    delivery = models.TextField(default='State whether same day delivery possible and cut-off time for such delivery')
    operator_requirement = models.TextField(default='State whether a licensed operator is required for hire of the product')
    stock = models.IntegerField(default=0)

    class Meta:
        verbose_name_plural = "products to hire"
    def __str__(self):
        return self.name

# Product-buying-related classes

class Buy_category(models.Model):
    group = models.CharField(max_length=200, default='Category')
    description = models.TextField(default='Description of buy category')
    image_for_category = models.FileField(upload_to='images/buy_categories', null=True)
    most_popular = models.CharField(max_length=250, default='')
    class Meta:
        verbose_name_plural = "buy categories"
    def __str__(self):
        return self.group

class Product_to_buy(models.Model):

    name = models.CharField(max_length=250, default='Name')
    code = models.CharField(max_length=30, default='B/0000') # The product id you assign to the product
    mode = models.CharField(max_length=30, default='Buy')
    image_1 = models.FileField(upload_to='images/products_to_buy', null=True)
    image_2 = models.FileField(upload_to='images/products_to_buy', null=True)
    image_3 = models.FileField(upload_to='images/products_to_buy', null=True)
    image_4 = models.FileField(upload_to='images/products_to_buy', null=True)
    image_5 = models.FileField(upload_to='images/products_to_buy', null=True)
    description = models.TextField(default='Description of product to buy')
    safety = models.FileField(upload_to='', null=True)
    retail_price = models.DecimalField(max_digits=7, decimal_places=2, default='1.00')
    vat = models.TextField(default='State whether rate includes or excludes VAT')
    mean_rating = models.IntegerField(default=0) # See commentary for mean_rating in Product_to_hire
    buy_category = models.ForeignKey(Buy_category, on_delete=models.CASCADE)
    buy_category_accessible = models.TextField(max_length=250, default='State foreign key chosen (Note: Entering this here makes the foreign key text more accessible for html template syntax purposes)')
    special = models.TextField(default='State key exclusions or inclusions with the product to buy (for example, are batteries included?)')
    delivery = models.TextField(default='State whether same day delivery possible and cut-off time for such delivery')
    stock = models.IntegerField(default=0)

    class Meta:
        verbose_name_plural = "products to buy"
    def __str__(self):
        return self.name

# Ordering-related classes

class Order(models.Model):
    user = models.CharField(max_length=100, default='User')
    code = models.CharField(max_length=30, default='Code')
    unit_price = models.DecimalField(max_digits=9, decimal_places=2, default=0.00)
    cost_to_hire = models.DecimalField(max_digits=9, decimal_places=2, default=0.00)
    unit_hire_rate = models.DecimalField(max_digits=9, decimal_places=2, default=0.00)
    quantity = models.IntegerField(default=0)
    duration = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    start = models.CharField(max_length=30, default='Not applicable')
    end = models.CharField(max_length=30, default='Not applicable')
    timestamp = models.DateTimeField(default=datetime.datetime.now())
    transaction_key = models.TextField(default='Transaction Key')
    filled = models.TextField(default='See Filled_order class (not Order class) in ordersdb database')
    shipped = models.TextField(default='See Filled_order class (not Order class) in ordersdb database')

class Filled_order(models.Model):
    user = models.CharField(max_length=100, default='User')
    code = models.CharField(max_length=30, default='Code')
    unit_price = models.DecimalField(max_digits=9, decimal_places=2, default=0.00)
    cost_to_hire = models.DecimalField(max_digits=9, decimal_places=2, default=0.00)
    unit_hire_rate = models.DecimalField(max_digits=9, decimal_places=2, default=0.00)
    quantity = models.IntegerField(default=0)
    duration = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    start = models.CharField(max_length=30, default='Not applicable')
    end = models.CharField(max_length=30, default='Not applicable')
    timestamp = models.TextField(default="TEXTFIELD HERE IS NOT AN ERROR - in the Filled_order class, do not make timestamp a datetime object (and do not change the name 'timestamp' either!). Also, see Filled_order class in filledordersdb database")
    transaction_key = models.TextField(default='Transaction Key')
    filled = models.CharField(max_length=100, default='See Filled_order class in filledordersdb database')
    shipped = models.TextField(default='See Filled_order class in filledordersdb database')

class Total(models.Model):
    user = models.CharField(max_length=250, default='User')
    name = models.CharField(max_length=250, default='')
    total = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    timestamp = models.DateTimeField(default=datetime.datetime.now())
    transaction_key = models.TextField(default='Transaction Key')

# Payment-related classes

class Payment(): # The argument will depend on the payment API you decide to use - It cannot be models.Model
    # The structure of this model will depend on the payment API being used
    pass

class Payment_card(models.Model):
    user = models.CharField(max_length=250, default='User')
    name_on_card = models.CharField(max_length=250, default='Name on card')
    card_number = models.CharField(max_length=250, default='Card number')
    expiry_date = models.CharField(max_length=30, default='Card number')
    security_code = models.CharField(max_length=30, default='Security code')
    country = models.CharField(max_length=250, default='Country')
    total = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    timestamp = models.DateTimeField(default=datetime.datetime.now())
    transaction_key = models.TextField(default='Transaction Key')
    claimed = models.CharField(max_length=100, default='See Payment_card class in ordersdb database')

# Delivery/shipping-related class

class Shipping_address(models.Model):
    user = models.CharField(max_length=250, default='User')
    name = models.CharField(max_length=250, default='')
    address = models.CharField(max_length=250, default='Address')
    town = models.CharField(max_length=250, default='Town/City')
    country = models.CharField(max_length=250, default='Country')
    postcode = models.CharField(max_length=250, default='Postcode')
    timestamp = models.DateTimeField(default=datetime.datetime.now())
    transaction_key = models.TextField(default='Transaction Key')

# Rating-of-product-related classes

class Customer_ph_rating(models.Model):
    name = models.CharField(max_length=250, default='')
    email = models.CharField(max_length=250, default='')
    product_hired = models.CharField(max_length=250, default='Null')
    code = models.CharField(max_length=30, default='H/0000')
    product_hired_rating_1 = models.IntegerField(default=1)
    product_hired_rating_2 = models.IntegerField(default=2)
    product_hired_rating_3 = models.IntegerField(default=3)
    product_hired_rating_4 = models.IntegerField(default=4)
    product_hired_rating_5 = models.IntegerField(default=5)
    rating_selected = models.IntegerField(default=0)
    comments_heading = models.CharField(max_length=250, default='')
    comments = models.TextField(default='Comments')
    date_posted = models.DateTimeField(default=datetime.datetime.now())
    @property
    def date_posted_string(self):
        return self.date_posted.strftime("%d %B %Y")
    def __str__(self):
        return self.product_hired

class Hire_before_rate(models.Model):
    product = models.ForeignKey(Product_to_hire, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)

class Customer_pb_rating(models.Model):
    name = models.CharField(max_length=250, default='')
    email = models.CharField(max_length=250, default='')
    product_bought = models.CharField(max_length=250, default='Null')
    code = models.CharField(max_length=30, default='B/0000')
    product_bought_rating_1 = models.IntegerField(default=1)
    product_bought_rating_2 = models.IntegerField(default=2)
    product_bought_rating_3 = models.IntegerField(default=3)
    product_bought_rating_4 = models.IntegerField(default=4)
    product_bought_rating_5 = models.IntegerField(default=5)
    rating_selected = models.IntegerField(default=0)
    comments_heading = models.CharField(max_length=250, default='')
    comments = models.TextField(default='Comments')
    date_posted = models.DateTimeField(default=datetime.datetime.now())
    @property
    def date_posted_string(self):
        return self.date_posted.strftime("%d %B %Y")
    def __str__(self):
        return self.product_bought

class Buy_before_rate(models.Model):
    product = models.ForeignKey(Product_to_buy, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)