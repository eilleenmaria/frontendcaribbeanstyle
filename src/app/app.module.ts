import { NgModule, CUSTOM_ELEMENTS_SCHEMA,  } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {BrowserAnimationsModule, NoopAnimationsModule} from '@angular/platform-browser/animations';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { CartComponent } from './components/cart/cart.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { HomeComponent } from './components/home/home.component';
import { ProductComponent } from './components/product/product.component';
import { ThankyouComponent } from './components/thankyou/thankyou.component';
import {HttpClientModule} from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import {  SocialLoginModule,
          SocialAuthServiceConfig,
          GoogleLoginProvider,
          FacebookLoginProvider,
          GoogleSigninButtonDirective,
          GoogleSigninButtonModule,
          } from '@abacritt/angularx-social-login';

import { HomeLayoutComponent } from './components/home-layout/home-layout.component';
import { RegisterComponent } from './components/register/register.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    CartComponent,
    CheckoutComponent,
    HomeComponent,
    ProductComponent,
    ThankyouComponent,
    LoginComponent,
    ProfileComponent,
    HomeLayoutComponent,
    RegisterComponent

  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NoopAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    NgxSpinnerModule,
    ReactiveFormsModule,
    FormsModule,
    ToastrModule.forRoot(),
    SocialLoginModule,
    GoogleSigninButtonModule,
  ],
  providers: [
     {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '415551150410-jp6e6afjn6es5tlmei267aim9mfqid1a.apps.googleusercontent.com'
            )
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider('clientId')
          }
        ],
        onError: (err) => {
          console.error(err);
        }
      } as SocialAuthServiceConfig,
    },
    GoogleSigninButtonDirective,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }
