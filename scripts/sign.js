//Параметры заголовка
window.onscroll = function() {stickyHeader()};

var header = document.getElementById("main_h");
var sticky = header.offsetTop;

function stickyHeader() {
    if (window.pageYOffset >= sticky) {
        header.classList.add("fixed");
    } else {
        header.classList.remove("fixed");
    }
}

//Загрузка учетной записи и функционала страницы
var forms=document.getElementById("forms");
var login=document.getElementById("a-login");
var register=document.getElementById("a-register");
var requestURL="../php/intropage.php";
var account=document.getElementById('account');
userCheck();

//Функция подгрузки учетной записи
function userCheck(){
    //Запрос статуса сессии
    let request=new XMLHttpRequest();
    request.open('GET', requestURL);
    request.responseType="json";
    request.send();
    request.onload=function(){
        if(request.response==null){ //При отсутствии сессии отобразить поле входа или регистрации
            register.value="Back";
            register.onclick=function(){
                location.href = "..";
            }
            let message=document.getElementById('signin-prompt-message');    //Нужно добавить отображение специальных сообщений

            let sign_id=window.location.href.split("?")[1].split("=")[1];
            if(sign_id=="in"){   //Форма входа в учетную запись
                login.value="Sign Up";
                login.onclick=function(){
                    location.href = "./sign.html?id="+"up";
                }
                
                let form=document.getElementById('signinform');
                let container=document.getElementById('prompt-signinform-container');
                let lost_passw_button=document.getElementById("lost_passw");
                container.style.display='block';
                
                form.cancel.onclick=function(){
                    location.href = "..";
                };
                
                form.sign_in.onclick=function(){
                    let requestURL="../php/log.php";
                    form=document.querySelector('#signinform');
                    formData=new FormData(form);
                    formData.append("sign_in", "");
                    data=new URLSearchParams(formData);
                    let login_status;
                    fetch(requestURL,{
                        method: 'POST',
                        body: data
                    })
                        .then(response=>response.text())
                        .then(result=>login_status=result);
                    //Загрузка ответа сервера
                    let loading_status=false;
                    let logtimerId = setInterval(() => {
                        if(login_status==="EMPTY"){
                            message.innerText="All fields are required!";
                        }else if(login_status==="INVLEN"){
                            message.innerText="Max 32 symbols in fields!";
                        }else if(login_status==="INVLOG"){
                            message.innerText="Invalid Username!";
                        }else if(login_status==="INVPAS"){
                            message.innerText="Invalid Password!";
                        }else if(login_status==="UNKER"){
                            message.innerText="Unknown Server Error\nPlease contact administration.";
                        }else if((login_status==="ACLOG")||(login_status=="ALLOG")){
                            userCheck();
                        }
                        if(typeof(login_status)=="string"){
                            loading_status=true;
                            clearInterval(logtimerId);
                        }
                    }, 100);
                    //Прерывание по истечении 3 секунд
                    setTimeout(() => { 
                        if(loading_status==false){
                            clearInterval(logtimerId);
                            message.innerText="Cannot connect to server\nPlease contact administration.";
                        }
                    }, 3000);
                }

                lost_passw_button.onclick=function(){
                    document.getElementById('signin-prompt-header').textContent="Remember password";
                    message.textContent="Insert email or login to get email instruction to reset password";
                    document.getElementById('form-prompt-username').textContent="Login or Email";
                    document.getElementById('form-prompt-password').style.display="none";
                    document.getElementById('signin-prompt-header').style.fontSize="none";
                    document.getElementById('signin-prompt-message').style.display="top: 100px; left: 10%; right: 5%; text-decoration-line: unset; font-size: 15px;";
                    document.getElementById('form-prompt-password-input').style.display="none";
                    form.sign_in.value="Reset password";
                    form.cancel.onclick=function(){
                        document.getElementById('signin-prompt-header').textContent="Sign In";
                        message.textContent="";
                        document.getElementById('form-prompt-username').textContent="Username";
                        document.getElementById('form-prompt-password').textContent="Password";
                        form.sign_in.value="Sign In";
                        document.getElementById('signin-prompt-header').style.fontSize="font-size: xx-large";
                        document.getElementById('signin-prompt-message').style.display="left: 30%; font-size: xx-large; text-decoration-line: underline";
                        document.getElementById('form-prompt-password').style.display="block";
                        document.getElementById('form-prompt-password-input').style.display="block";
                        userCheck();
                    }

                    form.sign_in.onclick=function(){
                        let requestURL="../php/lost_passw.php";
                        form=document.querySelector('#signinform');
                        formData=new FormData(form);
                        formData.append("lost_passw", "");
                        data=new URLSearchParams(formData);
                        let remember_status;
                        fetch(requestURL,{
                            method: 'POST',
                            body: data
                        })
                            .then(response=>response.text())
                            .then(result=>remember_status=result);
                        //Загрузка ответа сервера
                        let loading_status=false;
                        let logtimerId = setInterval(() => {
                            if(remember_status==="EMPTY"){
                                message.innerText="field is required!";
                            }else if(remember_status==="INVLEN"){
                                message.innerText="Max 64 symbols for email!";
                            }else if(remember_status==="INVLOG"){
                                message.innerText="User not found!";
                            }else if(remember_status==="INVEML"){
                                message.innerText="Non-confirmed email!";
                            }else if(remember_status==="UNKER"){
                                message.innerText="Unknown Server Error\nPlease contact administration.";
                            }else if(remember_status==="SUCCESS"){
                                message.innerText="Letter with new password has been sent to your email";
                                document.getElementById('signin-prompt-header').textContent="Sign In";
                                document.getElementById('form-prompt-username').textContent="Username";
                                document.getElementById('form-prompt-password').textContent="Password";
                                form.sign_in.value="Sign In";
                                document.getElementById('form-prompt-password').style.display="block";
                                document.getElementById('form-prompt-password-input').style.display="block";
                                userCheck();
                            }
                            if(typeof(remember_status)=="string"){
                                loading_status=true;
                                clearInterval(logtimerId);
                            }
                        }, 100);
                        //Прерывание по истечении 3 секунд
                        setTimeout(() => { 
                            if(loading_status==false){
                                clearInterval(logtimerId);
                                message.innerText="Cannot connect to server\nPlease contact administration.";
                            }
                        }, 3000);
                    }
                }

            }else if(sign_id=="up"){    //Форма регистрации учетной записи
                login.value="Sign In";
                login.onclick=function(){
                    location.href = "./sign.html?id="+"in";
                }
                
                let form=document.getElementById('signupform');
                let container=document.getElementById('prompt-signupform-container');
                container.style.display='block';
                    
                form.cancel.onclick=function(){
                    location.href = "..";
                };
                    
                form.sign_up.onclick=function(){
                    let requestURL="../php/reg.php";
                    form=document.querySelector('#signupform');
                    formData=new FormData(form);
                    formData.append("sign_up", "");
                    data=new URLSearchParams(formData);
                    let reger_status;
                    fetch(requestURL,{
                        method: 'POST',
                        body: data
                    })
                        .then(response=>response.text())
                        .then(result=>reger_status=result);
                    //Загрузка ответа сервера
                    let loading_status=false;
                    let regtimerId = setInterval(() => {
                        if(reger_status==="EMPTY"){
                            message.innerText="All fields are required!";
                        }else if(reger_status==="BUSY"){
                            message.innerText="Username already exist!";
                        }else if(reger_status==="SUCCESS"){
                            userCheck();
                        }else if(reger_status==="FAIL"){
                            message.innerText="Unknown Server Error\nPlease contact administration.";
                        }else if(reger_status==="TLDR"){
                            message.innerText="Max 32 symbols in fields!";
                        }
                        if(typeof(reger_status)=="string"){
                            loading_status=true;
                            clearInterval(regtimerId);
                        }
                    }, 100);
                    //Прерывание по истечении 3 секунд
                    setTimeout(() => { 
                        if(loading_status==false){
                            clearInterval(regtimerId);
                            message.innerText="Cannot connect to server\nPlease contact administration.";
                        }
                    }, 3000);
                }
            }
        } else {    //При активной сессии вернуться на главную страницу
            location.href = "..";
        }
    }
}
