from django.shortcuts import render, redirect
from django.db.models.query import EmptyQuerySet
from django.db.models import Q
from .models import *
from .utils import base
from decimal import *
import datetime

from django.http import HttpResponse
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from django.contrib.auth.decorators import login_required
#from .forms import CreateUserForm
from .forms import *

# Create your views here.

import requests

# Create your views here.

# Author: Charles Umesi

# Relating to customer authentication

def registerPage(request):

    """View for register.html"""

    if request.user.is_authenticated:
        return redirect('index')
    else:
        form = UserAdminCreationForm(request.POST)
        if request.method == 'POST':
            form = UserAdminCreationForm(request.POST)
            if form.is_valid():
                form.save()
                user = form.cleaned_data.get('email')
                messages.success(request, 'Account was created for ' + user)
                return redirect('login')
            else:
                messages.error(request, 'There was an error in one or more fields')
                return redirect('login')
        context = {
            'form': form
        }
        return render(request, 'catalog/registration/register.html', context)

def loginPage(request):

    """View for login.html"""

    if request.user.is_authenticated:
        return redirect('home')
    else:
        if request.method == 'POST':
            email = request.POST.get('email')
            password =request.POST.get('password')
            user = authenticate(request, email=email, password=password)
            if user is not None:
                login(request, user)
                return redirect('index')
            else:
                messages.info(request, 'Username OR password is incorrect')
        context = {}
        return render(request, 'catalog/login.html', context)

def logoutUser(request):
    logout(request)
    return redirect('login')

# Relating to products

def index(request):
    """View for index.html"""
    context = base(request)
    return render(request, 'catalog/index.html', context)

def search(request):

    """View for search.html"""

    if request.method == 'POST':
        query = request.POST['query']
        product_to_hire_query = Product_to_hire.objects.filter(Q(name__icontains=query) | Q(code__icontains=query) | Q(hire_category_accessible__icontains=query) | Q(mode__icontains=query))
        product_to_buy_query = Product_to_buy.objects.filter(Q(name__icontains=query) | Q(code__icontains=query) | Q(buy_category_accessible__icontains=query) | Q(mode__icontains=query))

        if query == ' ' or len(query) == 0:
            return redirect('index')
        else:
            search_dict = {
                'query' : query,
                'product_to_hire_query' : product_to_hire_query,
                'product_to_buy_query' : product_to_buy_query,
            }
            context = {**search_dict, **base(request)}
            return render(request, 'catalog/search.html', context)

def hireCategory(request, hire_category_id):

    """View for hirecategory.html"""

    hire_category = Hire_category.objects.get(pk=hire_category_id)
    hire_category_dict = {
        'hire_category' : hire_category,
    }
    context = {**hire_category_dict, **base(request)}
    return render(request, 'catalog/ecommerce/hirecategory.html', context)

def productToHire(request, product_to_hire_id):

    """View for producttohire.html"""

    product_to_hire = Product_to_hire.objects.get(pk=product_to_hire_id)
    customer_ph_ratings = Customer_ph_rating.objects.all()
    ratings = []
    mean_rating_list = [] # For zero division error exceptions; see further down this view

    if request.method == 'POST' and Hire_before_rate.objects.using('primary').filter(product=product_to_hire, user=request.user).exists():
        product_name = request.POST['product_name']
        product_code = request.POST['product_code']
        rate_product = request.POST['rate_product']
        review_title = request.POST['review_title']
        comment = request.POST['comment']
        if rate_product == "1":
            save_reviewh = Customer_ph_rating(name=request.user, email='email@email.com',
            product_hired=product_name, code=product_code, product_hired_rating_1=1, product_hired_rating_2=0,
            product_hired_rating_3=0, product_hired_rating_4=0, product_hired_rating_5=0, rating_selected=1,
            comments_heading=review_title, comments=comment, date_posted=datetime.datetime.now())
        elif rate_product == "2":
            save_reviewh = Customer_ph_rating(name=request.user, email='email@email.com',
            product_hired=product_name, code=product_code, product_hired_rating_1=0, product_hired_rating_2=2,
            product_hired_rating_3=0, product_hired_rating_4=0, product_hired_rating_5=0, rating_selected=2,
            comments_heading=review_title, comments=comment, date_posted=datetime.datetime.now())
        elif rate_product == "3":
            save_reviewh = Customer_ph_rating(name=request.user, email='email@email.com',
            product_hired=product_name, code=product_code, product_hired_rating_1=0, product_hired_rating_2=0,
            product_hired_rating_3=3, product_hired_rating_4=0, product_hired_rating_5=0, rating_selected=3,
            comments_heading=review_title, comments=comment, date_posted=datetime.datetime.now())
        elif rate_product == "4":
            save_reviewh = Customer_ph_rating(name=request.user, email='email@email.com',
            product_hired=product_name, code=product_code, product_hired_rating_1=0, product_hired_rating_2=0,
            product_hired_rating_3=0, product_hired_rating_4=4, product_hired_rating_5=0, rating_selected=4,
            comments_heading=review_title, comments=comment, date_posted=datetime.datetime.now())
        elif rate_product == "5":
            save_reviewh = Customer_ph_rating(name=request.user, email='email@email.com',
            product_hired=product_name, code=product_code, product_hired_rating_1=0, product_hired_rating_2=0,
            product_hired_rating_3=0, product_hired_rating_4=0, product_hired_rating_5=5, rating_selected=5,
            comments_heading=review_title, comments=comment, date_posted=datetime.datetime.now())
        save_reviewh.save()
        return redirect('review')

    elif request.method == 'POST' and Hire_before_rate.objects.using('primary').filter(product=product_to_hire, user=request.user).exists() == False:
        return redirect('messagehire')

    # Calculation of mean rating for the product
    for customer_ph_rating in customer_ph_ratings:
        if customer_ph_rating.product_hired == product_to_hire.name:
            ratings.append(customer_ph_rating.rating_selected)

    total_ratings = sum(ratings)
    number_of_ratings = len(ratings)
    try:
        mean_rating_list.append(int(round(total_ratings/number_of_ratings, 0)))
    except:
        mean_rating_list.append(0)  # Prevents zero division error exceptions from being raised when the product is yet to receive a rating
    product_to_hire.mean_rating = mean_rating_list[0]
    product_to_hire.save()

    del(ratings, mean_rating_list)

    # Rendering variables for producttohire.html
    product_to_hire_dict = {
        'product_to_hire' : product_to_hire,
        'customer_ph_ratings' : customer_ph_ratings,
    }
    context = {**product_to_hire_dict, **base(request)}
    return render(request, 'catalog/ecommerce/producttohire.html', context)

def messageHire(request):
    """View for messagehire.html"""
    """Renders message if the user is rating a product s/he has not yet hired"""
    context = base(request)
    return render(request, 'catalog/ecommerce/messagehire.html', context) 

def buyCategory(request, buy_category_id):

    """View for buycategory.html"""

    buy_category = Buy_category.objects.get(pk=buy_category_id)
    buy_category_dict = {
        'buy_category' : buy_category,
    }
    context = {**buy_category_dict, **base(request)}
    return render(request, 'catalog/ecommerce/buycategory.html', context)

def productToBuy(request, product_to_buy_id):

    """View for producttobuy.html"""

    product_to_buy = Product_to_buy.objects.get(pk=product_to_buy_id)
    customer_pb_ratings = Customer_pb_rating.objects.all()
    ratings = []
    mean_rating_list = [] # For zero division error exceptions; see further down this view

    if request.method == 'POST' and Buy_before_rate.objects.using('primary').filter(product=product_to_buy, user=request.user).exists():
        product_name = request.POST['product_name']
        product_code = request.POST['product_code']
        rate_product = request.POST['rate_product']
        review_title = request.POST['review_title']
        comment = request.POST['comment']
        if rate_product == "1":
            save_reviewb = Customer_pb_rating(name=request.user, email='email@email.com',
            product_bought=product_name, code=product_code, product_bought_rating_1=1, product_bought_rating_2=0,
            product_bought_rating_3=0, product_bought_rating_4=0, product_bought_rating_5=0, rating_selected=1,
            comments_heading=review_title, comments=comment, date_posted=datetime.datetime.now())
        elif rate_product == "2":
            save_reviewb = Customer_pb_rating(name=request.user, email='email@email.com',
            product_bought=product_name, code=product_code, product_bought_rating_1=0, product_bought_rating_2=2,
            product_bought_rating_3=0, product_bought_rating_4=0, product_bought_rating_5=0, rating_selected=2,
            comments_heading=review_title, comments=comment, date_posted=datetime.datetime.now())
        elif rate_product == "3":
            save_reviewb = Customer_pb_rating(name=request.user, email='email@email.com',
            product_bought=product_name, code=product_code, product_bought_rating_1=0, product_bought_rating_2=0,
            product_bought_rating_3=3, product_bought_rating_4=0, product_bought_rating_5=0, rating_selected=3,
            comments_heading=review_title, comments=comment, date_posted=datetime.datetime.now())
        elif rate_product == "4":
            save_reviewb = Customer_pb_rating(name=request.user, email='email@email.com',
            product_bought=product_name, code=product_code, product_bought_rating_1=0, product_bought_rating_2=0,
            product_bought_rating_3=0, product_bought_rating_4=4, product_bought_rating_5=0, rating_selected=4,
            comments_heading=review_title, comments=comment, date_posted=datetime.datetime.now())
        elif rate_product == "5":
            save_reviewb = Customer_pb_rating(name=request.user, email='email@email.com',
            product_bought=product_name, code=product_code, product_bought_rating_1=0, product_bought_rating_2=0,
            product_bought_rating_3=0, product_bought_rating_4=0, product_bought_rating_5=5, rating_selected=5,
            comments_heading=review_title, comments=comment, date_posted=datetime.datetime.now())
        save_reviewb.save()
        return redirect('review')

    elif request.method == 'POST' and Buy_before_rate.objects.using('primary').filter(product=product_to_buy, user=request.user).exists() == False:
        return redirect('messagebuy')

    # Calculation of mean rating for the product
    for customer_pb_rating in customer_pb_ratings:
        if customer_pb_rating.product_bought == product_to_buy.name:
            ratings.append(customer_pb_rating.rating_selected)

    total_ratings = sum(ratings)
    number_of_ratings = len(ratings)
    try:
        mean_rating_list.append(int(round(total_ratings/number_of_ratings, 0)))
    except:
        mean_rating_list.append(0)  # Prevents zero division error exceptions from being raised when the product is yet to receive a rating
    product_to_buy.mean_rating = mean_rating_list[0]
    product_to_buy.save()

    del(ratings, mean_rating_list)

    # Rendering variables for producttobuy.html
    product_to_buy_dict = {
        'product_to_buy' : product_to_buy,
        'customer_pb_ratings' : customer_pb_ratings,
    }
    context = {**product_to_buy_dict, **base(request)}
    return render(request, 'catalog/ecommerce/producttobuy.html', context)

def review(request):
    """View for review.html"""
    """Renders message after the user has rated a product s/he previously bought or hired"""
    context = base(request)
    return render(request, 'catalog/ecommerce/review.html', context)    

def messageBuy(request):
    """View for messagebuy.html"""
    """Renders message if the user is rating a product s/he has not yet bought"""
    context = base(request)
    return render(request, 'catalog/ecommerce/messagebuy.html', context)

def cart(request):
    """"View for cart.html"""
    """Shopping cart is created by JavaScript"""
    context = base(request)
    return render(request, 'catalog/ecommerce/cart.html', context)

@login_required(login_url='login')
def checkout(request):

    """View for checkout.html"""
    """Transfers shopping cart order to cookie created by JavaScript"""

    # Component for verifying the correct cookie (with the correct order)
    visit_no = request.session.get('visit_no', 0)
    request.session['visit_no'] = visit_no + 1

    # I am also calling customer and shipping_address objects in this view and the next (for the templates)
    customers = Customer.objects.using('primary')
    shipping_addresses = Shipping_address.objects.using('primary')

    context = {
        'visit_no' : visit_no,
        'customers' : customers,
        'shipping_addresses' : shipping_addresses,
    }
    return render(request, 'catalog/ecommerce/checkout.html', context)

@login_required(login_url='login')
def payment(request):

    """View for payment.html"""

    """Saves customer details on server"""
    """NOTE: Despite the name, payment processing is NOT done by this view"""

    customers = Customer.objects.using('primary')
    shipping_addresses = Shipping_address.objects.using('primary')
    customer_transaction_key_list = []

    # Receipt of customer details
    if request.method == 'POST' and request.user.is_authenticated:
        # Billing address variables
        full_name = request.POST['full-name']
        email = request.POST['email']
        phone = request.POST['phone']
        street = request.POST['street']
        city = request.POST['city']
        country = request.POST['country']
        postcode = request.POST['postcode']

        # Save billing address details
        save_customer = Customer(user=request.user, name=full_name, email=email, phone=phone, street=street,
        town=city, country=country, postcode=postcode, timestamp=datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        transaction_key=request.session.session_key + "_" + str(request.session['visit_no'] - 1))
        save_customer.save()
        customer_transaction_key_list.append(request.session.session_key + "_" + str(request.session['visit_no'] - 1))

        # Shipping address variables
        s_full_name = request.POST['s-full-name']
        s_street = request.POST['s-street']
        s_city = request.POST['s-city']
        s_country = request.POST['s-country']
        s_postcode = request.POST['s-postcode']

        # Save shipping address details
        save_shipping = Shipping_address(user=request.user, name=s_full_name, address=s_street, town=s_city,
        postcode=s_postcode, country=s_country, timestamp=datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
        transaction_key=request.session.session_key + "_" + str(request.session['visit_no'] - 1))
        save_shipping.save()
        shipping_address_key_verifier = customer_transaction_key_list[0]
        del customer_transaction_key_list

    context = {
        'customers' : customers,
        'shipping_addresses' : shipping_addresses,
        'shipping_address_key_verifier' : shipping_address_key_verifier,
    }
    return render(request, 'catalog/ecommerce/payment.html', context)

@login_required(login_url='login')
def transactionProcessing(request):

    """View for transactionprocessing.html"""
    """Saves payment details on server and processes payment"""
    # NOTE: Requires a payment API which has not been installed with this app

    customers = Customer.objects.using('primary')

    if request.method == "POST" and request.user.is_authenticated:
        # Payment variables
        name_on_card = request.POST['name-on-card']
        card_number = request.POST['card-number']
        expiry_date = request.POST['expiry-date']
        security_code = request.POST['security-code']

        # Save payment details (for claim of payment from the customer's bank account)
        for customer in customers:
            if customer.transaction_key == request.session.session_key + "_" + str(request.session['visit_no'] - 1): 
                save_payment = Payment_card(user=request.user, name_on_card=name_on_card, card_number=card_number,
                expiry_date=expiry_date, security_code=security_code, country=customer.country, timestamp=datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                transaction_key=request.session.session_key + "_" + str(request.session['visit_no'] - 1),
                claimed='N')
                save_payment.save()

    return render(request, 'catalog/ecommerce/transactionprocessing.html')

@login_required(login_url='login')
def transactionComplete(request):

    """View for transactioncomplete.html"""

    """Saves customer's order on server"""
    """The order is received as a cookie, which is translated into 'English' by this view"""

    products_to_buy = Product_to_buy.objects.all()
    products_to_hire = Product_to_hire.objects.all()
    payment_cards = Payment_card.objects.using('primary')

    # Receipt of cookie
    if request.COOKIES["order_cookie_" + request.session.session_key + "_" + str(request.session['visit_no'] - 1)]:
        # As mentioned before, the '-1' prevents repeat addition whilst using for cookie verification later

        received_cookie = request.COOKIES["order_cookie_" + request.session.session_key + "_" + str(request.session['visit_no'] - 1)]

        # Processing of received_cookie so that it can be understood by staff filling the order
        groups = received_cookie.split(',')
        codes = groups[0].split('&')
        unitPrices = groups[1].split('&')
        costToHire = groups[2].split('&')
        unitHireRates = groups[3].split('&')
        quantities = groups[4].split('&')
        durations = groups[5].split('&')
        starts = groups[6].split('&')
        ends = groups[7].split('&')
        total = groups[8]

        # Transfer translated cookie (that is, order) to database so that shop staff can access it
        code_dict = {}
        superlist = list(zip(codes, unitPrices, costToHire, unitHireRates, quantities, durations, starts, ends)) # Note: total is NOT included here, but further down
        for i in superlist:
            save_order = Order(user=request.user, code=i[0], unit_price=i[1], cost_to_hire=i[2],
            unit_hire_rate=i[3], quantity=i[4], duration=i[5], start=i[6], end=i[7],
            timestamp=datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
            transaction_key=request.session.session_key + "_" + str(request.session['visit_no'] - 1),
            filled="N", shipped="N")
            save_order.save()
            code_dict[(i[0].split('_')[1])] = i[4]
        
        # Update stock levels
             
        for product_to_buy in products_to_buy:
            if product_to_buy.code in code_dict.keys():
                record_for_ratingb = Buy_before_rate(product=product_to_buy, user=request.user)
                record_for_ratingb.save()
                product_to_buy.stock = product_to_buy.stock - eval(code_dict[product_to_buy.code])
                product_to_buy.save()

        for product_to_hire in products_to_hire:
            if product_to_hire.code in code_dict.keys():
                record_for_ratingh = Hire_before_rate(product=product_to_hire, user=request.user)
                record_for_ratingh.save()
                product_to_hire.stock = product_to_hire.stock - eval(code_dict[product_to_hire.code])
                product_to_hire.save()

        # Transfer details of customer's money to be taken on to customer's payment card
        for payment_card in payment_cards:
            if payment_card.transaction_key == request.session.session_key + "_" + str(request.session['visit_no'] - 1) and payment_card.country == 'Nigeria':
                grand_total = eval(total) + (17.5/100 * eval(total)) + 1000
                save_total = Total(user=request.user, name=payment_card.name_on_card,
                total=grand_total, timestamp=datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                transaction_key=request.session.session_key + "_" + str(request.session['visit_no'] - 1))
                save_total.save()
                payment_card.total = grand_total
                payment_card.save()
            elif payment_card.transaction_key == request.session.session_key + "_" + str(request.session['visit_no'] - 1) and payment_card.country != 'Nigeria':
                grand_total = eval(total) + (17.5/100 * eval(total)) + 20000
                save_total = Total(user=request.user, name=payment_card.name_on_card,
                total=grand_total, timestamp=datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S'),
                transaction_key=request.session.session_key + "_" + str(request.session['visit_no'] - 1))
                save_total.save()
                payment_card.total = grand_total
                payment_card.save()

        del code_dict

        # Save total where transaction keys match (as shown below) - and add vat and shipping costs

    logout(request)
    return render(request, 'catalog/ecommerce/transactioncomplete.html')
