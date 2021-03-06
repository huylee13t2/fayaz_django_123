import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SimpleNotificationsModule, NotificationsService } from 'angular2-notifications';
import {ActivatedRoute} from '@angular/router';

// use jquery
import * as $ from 'jquery';

// service
import { MainService } from '../../app.service'

@Component({
	selector: 'page-login-sregister',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class LoginRegisterComponent implements OnInit {
	user : any = {
		type_account : 'paid',
	};
	forgot_pass : boolean;
	tab_login : boolean;
	tab_register : boolean;

	public token : string;

	constructor(
		private router: Router,
		private _main: MainService,
		private _service: NotificationsService,
		private route : ActivatedRoute
		){ 
		this.forgot_pass = true;
		this.tab_login = true;
		this.tab_register = false;
		// check token
		this.token = localStorage.getItem('token');
		if(this.token != null){
			this._main.getUser(this.token).then(res => {
				if(res.result > 0){
					this.router.navigate(['dashboard']);
				}
			});
		}
	}

	public options = {
		position: ["bottom", "right"],
		timeOut: 2000,
		lastOnBottom: true,
		showProgressBar: true,
		pauseOnHover: true,
		clickToClose: true
	}

	onBlurMethod(){
		console.log(this.user)
		if(this.user.password != this.user.re_password){
			this.forgot_pass = false;
			console.log(this.forgot_pass)
		} else{
			console.log(this.forgot_pass)
			this.forgot_pass = true;
		}
	}

	register() {
		console.log('register...........')
		console.log(this.user)

		this._main.signup(this.user).then(res => {
			console.log(res)
			if(res.result > 0){
				console.log('Signup!')
				this._service.success('Notification', 'Register succes!', this.options);

				if(this.token != undefined){
					this._main.invite(this.token);
				}

				setTimeout(() => {
					// this.tab_login = true;
					// this.tab_register = false;
					$('.tab_login').addClass('active');
					$('.tab_signup').removeClass('active');
					$('#login').addClass('active');
					$('#register').removeClass('active');
					$('.tab_login').attr('aria-expanded', 'true');
					$('.tab_signup').attr('aria-expanded', 'false');
				}, 2000);
			} else{
				this._service.warn('Notification', 'Register error!', this.options);
			}
		});
	}


	login(){
		console.log('login')

		this._main.login(this.user).then(res => {
			console.log(res)
			if(res.result > 0){
				this._service.success('Notification', 'Login succes!', this.options);
				let data = res.data;
				localStorage.setItem('token', data.token);
				localStorage.setItem('user', JSON.stringify({'username' : data.username, 'email' : data.email, 'avatar' : data.avatar, 'invite' : data.invite}));
				setTimeout(() => {
					if(data.invite >= 5){
						this.router.navigate(['dashboard']);
					} else{
						this.router.navigate(['invite']);
					}
				}, 2000);
			} else{
				this._service.warn('Notification', 'Login error!', this.options);
			}
		});
	}

	ngOnInit(): void{
		// this._main.getUser(this.token).then(res => {
			// 	if(res.result > 0){
				// 		this.user = res.data;
				// 		console.log(this.user)
				// 	}
				// });

				this.route.params.subscribe( params =>{
					this.token = params['token'];
					console.log('token = ' + this.token)
				})
			}
		}
