<?php
    //session_start();
    //if(!isset($_SESSION["session_login"])){
    //    header("Location: ../pages/sign.html?id=in");
    //}else 
    if($_GET['hash']){
        $hash=htmlspecialchars($_GET['hash']);
        //Получаем id и подтверждено ли Email
        require("./dbcon.php");
        if($result=mysqli_query($con, "SELECT `id`, `email_confirmed` FROM `userlist` WHERE `hash`='".$hash."'")) {
            while($row=mysqli_fetch_assoc($result)){ 
                $id=$row['id'];
                $emailstat=$row['email_confirmed'];
            }
            //Проверяет подтверждён ли Email
            if($emailstat!=1){
                //Если нет, то делаем подтверждение
                mysqli_query($con, "UPDATE `userlist` SET `email_confirmed`=1 WHERE `id`=".$id);
                $_SESSION['session_emailstat']=1;
                header("Location: ../pages/user.html");
            } else {
                header("Location: ../pages/sign.html?id=in");
            }
        } else {
            header("Location: ../pages/sign.html?id=in");
        }
    }else{
        header("Location: ../pages/index.html");
    }
    ?>