

function formValidation() 
{
    
    var uemail = document.register.email;
    var upass = document.register.pswd;
    if (email_valid(uemail)){
        if(pass_valid(upass)){
            console.log("True")
                    }
                }
    return false;
}


function email_valid(uemail) {
    var pattern = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if(uemail.value=="")
    {
        alert("Enter your Email ID!")
        return false;
    }
    if (uemail.value.match(pattern)) {
        return true;
    }
    else {
        alert("You have entered an invalid email address!");
        uemail.focus();
        return false;
    }
}

function pass_valid(upass)
{
var passid_len = upass.value.length;
if (passid_len == 0 ||passid_len < 7 || passid_len > 15)
{
alert("Password should not be empty / length be between 7 and 15");
upass.focus();
return false;
}
else
{
    alert("You have logged in!");
    // window.open('home.html', '_self');
    return true;   
}
}