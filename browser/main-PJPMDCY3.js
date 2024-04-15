import{$a as B,Ba as k,Da as _,E as M,Fa as E,Ha as T,Ia as N,J as m,Ja as b,K as v,Ma as V,Oa as j,P as F,Qa as A,R as p,Ra as D,Sa as W,Ta as G,Ua as R,Y as r,Z as l,Za as q,_ as u,ba as y,bb as a,ca as S,da as f,ja as w,ka as d,na as P,oa as L,pa as O,qa as I,ra as h,v as g,x as C,y as x}from"./chunk-L6ZM2QLE.js";function Y(t,o){if(t&1){let s=y();r(0,"button",14),S("click",function(){C(s);let e=f(),i=w(9);return x(e.login(i))}),d(1,"Login"),l()}if(t&2){f();let s=w(9);p("disabled",!s.valid)}}function Z(t,o){if(t&1){let s=y();r(0,"button",15),S("click",function(){C(s);let e=f();return x(e.logout())}),d(1,"Logout"),l()}}var U=(()=>{let o=class o{ngOnInit(){google.accounts.id.initialize({client_id:"45559034011-ecc5m4ure945sktlud7ph5giv7r6fkm1.apps.googleusercontent.com",callback:n=>this.handleLogin(n)}),google.accounts.id.renderButton(document.getElementById("google-btn"),{size:"large",shape:"rectangle",width:250})}decodeToken(n){return JSON.parse(atob(n.split(".")[1]))}handleLogin(n){if(n){let e=this.decodeToken(n.credential);sessionStorage.setItem("loggedInUser",JSON.stringify(e)),this.router.navigate(["dashboard"])}}constructor(n,e){this.authService=n,this.router=e,this.loginFormModel={username:"",password:""}}login(n){console.log(n),this.authService.login().subscribe(()=>{if(this.authService.isLoggedIn){let e="/dashboard",i={queryParamsHandling:"preserve",preserveFragment:!0};this.router.navigate([e],i)}})}logout(){this.authService.logOut()}};o.\u0275fac=function(e){return new(e||o)(v(a),v(b))},o.\u0275cmp=g({type:o,selectors:[["student-details-login"]],standalone:!0,features:[h],decls:21,vars:4,consts:[[1,"login-section"],[1,"login-section__form"],[1,"login-section__head"],[1,"text-white-50","mb-5"],["id","google-btn"],["loginForm","ngForm"],[1,"login-section__form--field"],["id","\xE7","name","username","type","text","required","",1,"form-control","form-control-input",3,"ngModel","ngModelChange"],["for","loginFormModel"],["id","password","name","password","type","password","required","",1,"form-control","form-control-input",3,"ngModel","ngModelChange"],["for","password"],[1,"button-container"],["class","btn btn-outline-light btn-lg px-5",3,"disabled","click",4,"ngIf"],["class","btn btn-outline-light btn-lg px-5",3,"click",4,"ngIf"],[1,"btn","btn-outline-light","btn-lg","px-5",3,"disabled","click"],[1,"btn","btn-outline-light","btn-lg","px-5",3,"click"]],template:function(e,i){e&1&&(r(0,"section",0)(1,"div",1)(2,"div",2)(3,"h2"),d(4,"Login"),l(),r(5,"p",3),d(6,"Please enter your login and password!"),l()(),u(7,"div",4),r(8,"form",null,5)(10,"div",6)(11,"input",7),O("ngModelChange",function(c){return L(i.loginFormModel.username,c)||(i.loginFormModel.username=c),c}),l(),r(12,"label",8),d(13,"Email"),l()(),r(14,"div",6)(15,"input",9),O("ngModelChange",function(c){return L(i.loginFormModel.password,c)||(i.loginFormModel.password=c),c}),l(),r(16,"label",10),d(17,"Password"),l()(),r(18,"div",11),F(19,Y,2,1,"button",12)(20,Z,2,0,"button",13),l()()()()),e&2&&(m(11),P("ngModel",i.loginFormModel.username),m(4),P("ngModel",i.loginFormModel.password),m(4),p("ngIf",!i.authService.isLoggedIn),m(),p("ngIf",i.authService.isLoggedIn))},dependencies:[_,k,B,R,j,A,D,q,G,W],styles:[".login-section[_ngcontent-%COMP%]{height:100vh;display:flex;align-content:center;flex-direction:column;justify-content:center;align-items:center}.login-section__head[_ngcontent-%COMP%]{text-transform:uppercase!important;margin-bottom:16px;display:flex;flex-direction:column;align-items:center}.login-section[_ngcontent-%COMP%]   #google-btn[_ngcontent-%COMP%]{padding-bottom:10px}.login-section__form[_ngcontent-%COMP%]{padding:57px;border-radius:8px;display:flex;flex-direction:column;justify-content:center;align-items:center;color:#fff;background-color:#211c19}.login-section__form--field[_ngcontent-%COMP%]{display:flex;flex-direction:column;align-items:center;margin-bottom:16px}.login-section[_ngcontent-%COMP%]   .button-container[_ngcontent-%COMP%]{display:flex;justify-content:center;width:100%}.login-section[_ngcontent-%COMP%]   .button-container[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]{margin:0;padding:0}"]});let t=o;return t})();var z=(t,o)=>{let s=M(b);return M(a).isLoggedIn?!0:s.createUrlTree(["/login"])};var H=[{path:"login",component:U},{path:"dashboard",loadChildren:()=>import("./chunk-A4NCQCFW.js").then(t=>t.DashboardModule),canMatch:[z]}];var J={providers:[V(H),E(),a]};var K=(()=>{let o=class o{constructor(){this.title="jobberUI"}};o.\u0275fac=function(e){return new(e||o)},o.\u0275cmp=g({type:o,selectors:[["jobber-root"]],standalone:!0,features:[I([a]),h],decls:1,vars:0,template:function(e,i){e&1&&u(0,"router-outlet")},dependencies:[N,_],styles:[".students-record[_ngcontent-%COMP%]{padding:16px;margin-left:60px}.students-record__record_table[_ngcontent-%COMP%]{border:1px solid #f0f0f0}.students-record.sidebarExpanded[_ngcontent-%COMP%]{margin-left:250px}"]});let t=o;return t})();T(K,J).catch(t=>console.error(t));
