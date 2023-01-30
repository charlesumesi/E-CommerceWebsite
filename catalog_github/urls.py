"""catalog_github URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from catalog import views, models
from django.conf import settings
from django.views.generic import RedirectView
from django.conf.urls.static import static
from django.contrib.auth import views as auth_views

# Paths author: Charles Umesi

urlpatterns = [

    path('admin/', admin.site.urls),
    path('', views.index, name='index'),
    path('search/', views.search, name='search'),
    path('search/', RedirectView.as_view(url='catalog/', permanent=True)),

    path('hirecategory/<hire_category_id>/', views.hireCategory, name='hirecategory'),
    path('hirecategory/<hire_category_id>/', RedirectView.as_view(url='catalog/', permanent=True)),
    path('producttohire/<product_to_hire_id>/', views.productToHire, name='producttohire'),
    path('producttohire/<product_to_hire_id>/', RedirectView.as_view(url='catalog/', permanent=True)),

    path('buycategory/<buy_category_id>/', views.buyCategory, name='buycategory'),
    path('buycategory/<buy_category_id>/', RedirectView.as_view(url='catalog/', permanent=True)),
    path('producttobuy/<product_to_buy_id>/', views.productToBuy, name='producttobuy'),
    path('producttobuy/<product_to_buy_id>/', RedirectView.as_view(url='catalog/', permanent=True)),

    path('review/', views.review, name='review'),
    path('review/', RedirectView.as_view(url='catalog/', permanent=True)),
    path('messagehire/', views.messageHire, name='messagehire'),
    path('messagehire/', RedirectView.as_view(url='catalog/', permanent=True)),
    path('messagebuy/', views.messageBuy, name='messagebuy'),
    path('messagebuy/', RedirectView.as_view(url='catalog/', permanent=True)),  
    path('cart/', views.cart, name='cart'),
    path('cart/', RedirectView.as_view(url='catalog/', permanent=True)),
    path('checkout/', views.checkout, name='checkout'),
    path('checkout/', RedirectView.as_view(url='catalog/', permanent=True)),
    path('payment/', views.payment, name='payment'),
    path('payment/', RedirectView.as_view(url='catalog/', permanent=True)),
    path('transactionprocessing/', views.transactionProcessing, name='transactionprocessing'),
    path('transactionprocessing/', RedirectView.as_view(url='catalog/', permanent=True)),
    path('transactioncomplete/', views.transactionComplete, name='transactioncomplete'),
    path('transactioncomplete/', RedirectView.as_view(url='catalog/', permanent=True)),

    path('register/', views.registerPage, name='register'),
    path('register/', RedirectView.as_view(url='catalog/', permanent=True)),
    path('login/', views.loginPage, name='login'),
    path('login/', RedirectView.as_view(url='catalog/', permanent=True)),
    path('logout/', views.logoutUser, name='logout'),
    path('logout/', RedirectView.as_view(url='catalog/', permanent=True)),


    path('password_reset_form/', auth_views.PasswordResetView.as_view(template_name='catalog/registration/password_reset_form.html'), name='password_reset_form'),
    path('password_reset_form/', RedirectView.as_view(url='catalog/', permanent=True)),

    path('password_reset_done/', auth_views.PasswordResetDoneView.as_view(template_name='catalog/registration/password_reset_done.html'), name='password_reset_done'),
    path('password_reset_done/', RedirectView.as_view(url='catalog/', permanent=True)),

    path('password_reset_confirm/<uidb64>/<token>/', auth_views.PasswordResetConfirmView.as_view(template_name='catalog/registration/password_reset_confirm.html'), name='password_reset_confirm'),
    path('password_reset_confirm/<uidb64>/<token>/', RedirectView.as_view(url='catalog/', permanent=True)),

    path('password_reset_complete/', auth_views.PasswordResetCompleteView.as_view(template_name='catalog/registration/password_reset_complete.html'), name='password_reset_complete'),
    path('password_reset_complete/', RedirectView.as_view(url='catalog/', permanent=True)),

] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
