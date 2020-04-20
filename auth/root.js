function getCookie() {
    const splitCookieString = document.cookie.split(";");
    let cookieValue;
    splitCookieString.forEach((eachCookieSaved) => {
        const splitEchCookieSaved = eachCookieSaved.split("=");
        if (splitEchCookieSaved[0] === "token") {
            cookieValue = splitEchCookieSaved[1];
        }
    });
    return cookieValue
}
// getCookie()
const cookieValue = getCookie();

function login() {

    var resultDisplay = document.getElementById("form-result");

    resultDisplay.style.display = "none";

    document.getElementById('login').addEventListener("click", function(event) {

        event.preventDefault()

    });

    //function submitBtn(){
    $('.loading').on('click', function() {

        var $btn = $(this);

        $btn.button('loading');

        resultDisplay.style.display = "none";

        Email = document.getElementById('email').value;

        Password = document.getElementById('password').value;

        if (Email.length > 0 && Password.length > 0) {

            const urlLink = "https://secsoftincapi.herokuapp.com/login";

            const dataObject = {

                email: Email,

                password: Password
            }

            axios({

                method: 'POST',

                url: urlLink,

                data: dataObject

            })

            .then(function(response) {

                    function setCookie(cname, cvalue, exdays) {
                        var d = new Date();
                        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
                        var expires = "expires=" + d.toUTCString();
                        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";


                    }

                    setCookie("token", response.data.token, 1);

                    if (response.request.response == "Your account is inactive. Please check your email to verify.") {

                        resultDisplay.style.display = "inline";

                        resultDisplay.innerHTML = "Your account is inactive. Please check your email to verify.";

                        $btn.button('reset');


                    } else if (response.data.message.data.firstName.length > 0 && response.data.message.data.lastName.length > 0 && response.data.message.data.firstName.length > 0) {

                        resultDisplay.innerHTML = "redirecting..."


                        setCookie("token", response.data.token, 1);

                        $btn.button('reset');

                        try {

                            if (sessionStorage.getItem("redirection").length > 0) {

                                location.replace(sessionStorage.getItem("redirection"));

                            } else {

                                location.replace("../../");

                            }

                        } catch (e) {

                            location.replace("../../");

                        }
                    } else {
                        resultDisplay.style.display = "inline";

                        resultDisplay.innerHTML = "Sorry, we encountered an error. kindly login again";

                        $btn.button('reset');

                    }

                })
                .catch(function(err) {

                    if (err.message == "Network Error") {

                        resultDisplay.style.display = "inline";

                        resultDisplay.innerHTML = "Sorry, an error occurred due to poor network";

                        $btn.button('reset');

                    } else if (err.response.data == "Wrong email/password combination.") {
                        resultDisplay.style.display = "inline";

                        resultDisplay.innerHTML = "Incorrect Email/Password";

                        $btn.button('reset');
                    }
                })

        } else {

            resultDisplay.style.display = "inline";

            resultDisplay.innerHTML = "All fields must be filled";

            $btn.button('reset');
        }
        //}
    });
}


function createAccount() {
    var resultDisplay = document.getElementById("form-result");

    resultDisplay.style.display = "none";

    //function submitBtn(){
    $('#signup').on('click', function() {

        var $btn = $(this);

        $btn.button('loading');

        resultDisplay.style.display = "none";

        Email = document.getElementById('email').value;

        Password = document.getElementById('password').value;

        confirmPassword = document.getElementById('cpassword').value;

        FirstName = document.getElementById('firstName').value;

        LastName = document.getElementById('lastName').value;

        if (Email.length > 0 && Password.length > 0 && FirstName.length > 0 && LastName.length > 0 && confirmPassword.length > 0) {
            if (Password == confirmPassword && Password.length > 7) {

                const urlLink = "https://secsoftincapi.herokuapp.com/register/user";

                const dataObject = {

                    firstName: FirstName,
                    lastName: LastName,
                    email: Email,
                    password: Password
                }

                axios({
                    method: 'POST',
                    url: urlLink,
                    data: dataObject
                })

                .then(function(response) {
                        console.log(response);
                        if (response.request.status == 200 && response.request.statusText == "OK") {

                            document.getElementById('verify').style.display = "initial";

                            document.getElementById('register').style.display = "none";

                            $btn.button('reset');

                        } else {
                            resultDisplay.style.display = "inline";

                            resultDisplay.innerHTML = "Sorry, we encountered an error. kindly submit again";

                            $btn.button('reset');
                        }
                    })
                    .catch(function(err) {
                        console.log(err)
                        if (err.message == "Request failed with status code 400") {
                            // ry = "'E11000 duplicate key error collection: secsoftinc.users index: email_1 dup key: { email: \'" + document.getElementById('email').value + "\  }";
                            // if (err.response.data == ry) {

                            resultDisplay.style.display = "inline";

                            resultDisplay.innerHTML = "Sorry, there is already an existing account with the email with us!";

                            // } else {
                            //     resultDisplay.style.display = "inline";

                            //     resultDisplay.innerHTML = "Sorry, we encountered an error. kindly submit again1";
                            // }


                            $btn.button('reset');
                        } else {
                            resultDisplay.style.display = "inline";

                            resultDisplay.innerHTML = "Sorry, we encountered an error. kindly submit again";

                            $btn.button('reset');
                        }

                        $btn.button('reset');
                    })

            } else {

                resultDisplay.style.display = "inline";

                resultDisplay.innerHTML = "Sorry, passwords did not match";

                $btn.button('reset');
            }

        } else {

            resultDisplay.style.display = "inline";

            resultDisplay.innerHTML = "All fields must be filled";

            $btn.button('reset');
        }
        //}
    });
}

function loadUserProfile() {
    $("#billing-card :input").prop("disabled", true);
    Message = document.getElementById('sendmessage');

    Message.style.display = "none";

    const urlLink = "https://secsoftincapi.herokuapp.com/user";

    const formData = new FormData();

    formData.append('token', getCookie());

    Message.style.display = "block";

    Message.innerHTML = "fetching user details";
    // if (sessionStorage.getItem("token").length == 0) {
    //     throw location.replace("https://secsoftinc.com/auth/login");
    // }
    axios({
            method: 'POST',

            body: formData,

            data: formData,

            url: urlLink

        })
        .then(function(response) {

            document.getElementById("loader").style.display = "none";
            Message.innerHTML = "";

            document.getElementById("firstName").value = response.data.firstName;

            document.getElementById("lastName").value = response.data.lastName;

            document.getElementById("email").value = response.data.email;

            document.getElementById("phone").value = response.data.phone;

            document.getElementById("dob").value = response.data.dob;

            document.getElementById("summary").value = response.data.summary;

            document.getElementById("title").value = response.data.title;

            document.getElementById("experience").value = response.data.experience;

            document.getElementById("education").value = response.data.education;

            document.getElementById("achievements").value = response.data.achievements;

            document.getElementById("address").value = response.data.address;

            document.getElementById("phone").value = response.data.phone;

            document.getElementById("grad").innerHTML = response.data.grad_date.slice(0, 10);

            if (response.data.resume.length > 0) {

                document.getElementById("profileResume").href = response.data.resume;

            }

            if (response.data.portfolio.length > 0) {

                document.getElementById("profilePortfolio").href = response.data.portfolio;

                document.getElementById("profileImgDisplay").style.display = "initial";

                document.getElementById("profileImgTemp").style.display = "none"

            } else {

                document.getElementById("profileImgDisplay").style.display = "none";

                document.getElementById("profileImgTemp").style.display = "initial"

            }

            if (response.data.user_image.length > 0) {

                document.getElementById("profileImg").src = response.data.user_image;

            }

            $("#billing-card :input").prop("disabled", false);


        })
        .catch(function(err) {

            document.getElementById("loader").style.display = "none";

            Message.style.display = "block";

            Message.innerHTML = "Sorry, session expired. redirecting in 3 secs to login...";
            //document.getElementById("billing-card").disabled = true;
            $("#billing-card :input").prop("disabled", true);

            setTimeout(function() {
                window.location.href = 'https://secsoftinc.com/auth/login';
            }, 3000);
        })

}

function updateUserProfile() {
    const formData2 = new FormData();

    formData2.append('token', getCookie());
    formData2.append('image', $('#image')[0].files[0]);
    formData2.append('phone', $('#phone').val());
    formData2.append('dob', $('#dob').val());
    formData2.append('address', $('#address').val());
    formData2.append('title', $('#title').val());
    formData2.append('summary', $('#summary').val());
    formData2.append('experience', $('#experience').val());
    formData2.append('achievement', $('#achievements').val());
    formData2.append('education', $('#education').val());
    formData2.append('grad_date', $('#grad_date').val());
    formData2.append('project', $('#projects').val());
    formData2.append('resume', $('#resume')[0].files[0]);
    formData2.append('portfolio', $('#portfolio')[0].files[0]);

    //function update() {
    //event.preventDefault();

    //prevent default action 

    submitUrl = "https://secsoftincapi.herokuapp.com/updateprofile";


    document.getElementById("updateProfile").innerHTML = "Updating...";

    Message.style.display = "block";

    axios({
            method: 'POST',

            body: formData2,

            data: formData2,

            url: submitUrl

        })
        .then(function(response) {

            document.getElementById("updateProfile").innerHTML = "Update";

            Message.innerHTML = "profile successfully updated";

        })
        .catch(function(err) {

            document.getElementById("updateProfile").innerHTML = "Re-try";

            Message.innerHTML = "failed to update profile";

        })
        //};
}

function controlElearning() {
    const urlLink1 = "https://secsoftincapi.herokuapp.com/user";

    const formData = new FormData();

    r = $(".courseList");

    j = $(".noteClass");

    p = $(".msgProfileCard");

    formData.append('token', getCookie());

    document.getElementById("profileIcon").style.display = "none";

    // document.getElementById("adminAction").style.display = "none";
    $(".adminAction").css("display", "none");

    document.getElementById("coursesDisplay").style.display = "none";

    document.getElementById("coursesMessage").style.display = "none";

    document.getElementById("coursesNotification").style.display = "none";

    document.getElementById("courseList").style.display = "none";

    document.getElementById("seeAllCourses").style.display = "none";

    document.getElementById("viewNote").style.display = "none";
    $(".signin").css("display", "none");
    axios({

        method: 'POST',

        body: formData,

        data: formData,

        url: urlLink1

    })

    .then(function(response) {
            $(".signin").css("display", "none");

            if (response.data.role == "suser") {

                // document.getElementById("adminAction").style.display = "initial";
                $(".adminAction").css("display", "block");

            }
            document.getElementById("coursesDisplay").style.display = "initial";

            document.getElementById("coursesMessage").style.display = "initial";

            document.getElementById("coursesNotification").style.display = "initial";

            if (response.data.messages.length > 0) {

                document.getElementById("msgProfileCard").style.display = "initial";

                document.getElementById("msgCardSubj").innerHTML = response.data.messages[0].subject;

                document.getElementById("msgCardBody").innerHTML = response.data.messages[0].body;

                document.getElementById("msgCardTime").innerHTML = response.data.messages[0].sent.slice(0, 10);

                document.getElementById("msgCardSender").innerHTML = response.data.messages[0].from.slice(0, 5);

                document.getElementById("noOfMessages").innerHTML = response.data.messages.length;

                for (msg = 1; msg < response.data.messages.length; msg++) {

                    p.clone().insertAfter(p);

                    document.getElementById("msgCardSender").innerHTML = response.data.messages[msg].from.slice(0, 5);

                    document.getElementById("msgCardSubj").innerHTML = response.data.messages[msg].subject;

                    document.getElementById("msgCardBody").innerHTML = response.data.messages[msg].body;

                    document.getElementById("msgCardTime").innerHTML = response.data.messages[msg].sent.slice(0, 10);
                }

            }
            if (response.data.notifications.length > 0) {

                document.getElementById("noteText").innerHTML = response.data.notifications[0].message;

                document.getElementById("noteTime").innerHTML = response.data.notifications[0].sent.slice(0, 10);

                document.getElementById("viewNote").style.display = "initial";

                document.getElementById("noOfNotes").innerHTML = response.data.notifications.length;

                for (k = 1; k < response.data.notifications.length; k++) {

                    j.clone().insertAfter(j);

                    document.getElementById("noteText").innerHTML = response.data.notifications[k].message;

                    document.getElementById("noteTime").innerHTML = response.data.notifications[k].sent.slice(0, 10);

                }

            } else {

                document.getElementById("noteText").innerHTML = "You've got no notifications yet";

            }

            if (response.data.enrolled.length > 0) {

                res = fetchCourseDetails(response.data.enrolled[0].course_unique_code);

                document.getElementById("seeAllCourses").style.display = "initial";

                document.getElementById("courseListLoading").style.display = "none";

                document.getElementById("noOfCourses").innerHTML = response.data.enrolled.length;

                document.getElementById("courseList").style.display = "block";

                $("#courseListName").html(res.title);

                document.getElementById("courseListUrl").href = "https://secsoftinc.com/elearning/course-intro/?code=" + res.unique_code;

                $("#courseListIcon").attr("src", res.image);

                $("#courseListCode").html(res.unique_code);

                for (i = 1; i < response.data.enrolled.length; i++) {

                    r.clone().insertAfter(r);

                    res = fetchCourseDetails(response.data.enrolled[i].course_unique_code);

                    $("#courseListName").html(res.title);

                    document.getElementById("courseListUrl").href = "https://secsoftinc.com/elearning/course-intro/?code=" + res.unique_code;

                    $("#courseListIcon").attr("src", res.image);

                    $("#courseListCode").html(res.unique_code);
                }

                document.getElementById("courseList").style.display = "initial";

                document.getElementById("seeAllCourses").href = "https://secsoftinc.com/elearning/my-courses";

            } else {

                document.getElementById("courseListLoading").style.display = "block";

                document.getElementById("courseListLoading").innerHTML = "No courses enrolled in yet";

                document.getElementById("courseListLoading").style.color = "red";

            }

            document.getElementById("loader").style.display = "none";
            // document.getElementById("wrapper").style.display = "initial";

            document.getElementById("profileIcon").style.display = "initial";

            document.getElementById("userName").innerHTML = response.data.firstName + " " + response.data.lastName;

            document.getElementById("profileImg").src = response.data.user_image;



        })
        .catch(function(err) {

            document.getElementById("courseList").style.display = "none";

            document.getElementById("loader").style.display = "none";
            // document.getElementById("wrapper").style.display = "initial";

            document.getElementById("profileIcon").style.display = "none";

            // document.getElementById("adminAction").style.display = "none";
            $(".adminAction").css("display", "none");


            // document.getElementById("signin").style.display = "initial";
            $(".signin").css("display", "block");


            document.getElementById("coursesDisplay").style.display = "none";

            document.getElementById("coursesMessage").style.display = "none";

            document.getElementById("coursesNotification").style.display = "none";

            document.getElementById("courseListLoading").style.display = "block";

            document.getElementById("courseListLoading").innerHTML = "Error displaying courses";

            document.getElementById("courseListLoading").style.color = "red";

        })

    axios({

        method: 'GET',

        url: "https://secsoftincapi.herokuapp.com/mostpopularcourses"

    })

    .then(function(response1) {

            if (response1.data.length > 0) {

                document.getElementById("mostpopular1").innerHTML = response1.data[0].title;

                document.getElementById("mostpopular2").innerHTML = response1.data[1].title;

                document.getElementById("mostpopular3").innerHTML = response1.data[2].title;

                document.getElementById("mostpopular4").innerHTML = response1.data[3].title;

                document.getElementById("mostpopular1").href = "https://secsoftinc.com/elearning/course-intro?code=" + response1.data[0].unique_code;

                document.getElementById("mostpopular2").href = "https://secsoftinc.com/elearning/course-intro?code=" + response1.data[1].unique_code;

                document.getElementById("mostpopular3").href = "https://secsoftinc.com/elearning/course-intro?code=" + response1.data[2].unique_code;

                document.getElementById("mostpopular4").href = "https://secsoftinc.com/elearning/course-intro?code=" + response1.data[3].unique_code;

            } else {
                document.getElementById("mostpopular1").innerHTML = response1.data[0].title;
            }

        })
        .catch(function(err2) {

            document.getElementById("mostpopular1").innerHTML = "Up coming!";

            document.getElementById("mostpopular2").innerHTML = "Up coming!";

            document.getElementById("mostpopular3").innerHTML = "Up coming!";

            document.getElementById("mostpopular4").innerHTML = "Up coming!";
        });
}

function loadAllCourses() {

    document.getElementById("loading").style.display = "initial";

    document.getElementById("allCourses").style.display = "none";

    document.getElementById("reload").style.display = "none";

    e = $(".course-1-item");

    const urlLink = "https://secsoftincapi.herokuapp.com/courses";

    function loadCourses() {

        document.getElementById("reload").innerHTML = "reloading...";

        $.ajax({

            url: urlLink,

            type: "GET",

            success: function(data, status) {

                document.getElementById("loading").style.display = "none";

                document.getElementById("allCourses").style.display = "block";

                document.getElementById("reload").style.display = "none";


                $("#courseTitle").html(data[0].title);

                if (data[0].description.split(" ").length >= 10) {

                    $("#courseDescription").html((data[0].description).split(" ").splice(0, 10).join(" ") + "...");

                } else {

                    $("#courseDescription").html((data[0].description));

                }

                if (data[0].objectives.split(" ").length >= 10) {

                    $("#courseObjective").html((data[0].objectives).split(" ").splice(0, 10).join(" ") + "...");

                } else {

                    $("#courseObjective").html((data[0].objectives));

                }

                $("#coursePrice").html("$" + data[0].course_fee);
                //$("#courseCode").attr("action", "localhost/secsoftinc/elearning/course-intro/" + data[0].unique_code);

                document.getElementById("courseCode").href = "https://secsoftinc.com/elearning/course-intro/?code=" + data[0].unique_code;

                $("#courseImage").attr("src", data[0].image);

                for (i = 1; i < data.length; i++) {

                    e.clone().insertAfter(e);

                    $("#courseTitle").html(data[i].title);

                    if (data[i].description.split(" ").length >= 10) {

                        $("#courseDescription").html((data[i].description).split(" ").splice(0, 10).join(" ") + "...");

                    } else {

                        $("#courseDescription").html((data[i].description));

                    }

                    if (data[i].objectives.split(" ").length >= 10) {

                        $("#courseObjective").html((data[i].objectives).split(" ").splice(0, 10).join(" ") + "...");

                    } else {

                        $("#courseObjective").html((data[i].objectives));

                    }

                    $("#coursePrice").html("$" + data[i].course_fee);
                    //$("#courseCode").attr("action", "localhost/secsoftinc/elearning/course-intro/" + data[i].unique_code);

                    document.getElementById("courseCode").href = "https://secsoftinc.com/elearning/course-intro/?code=" + data[i].unique_code;

                    $("#courseImage").attr("src", data[i].image);


                    $("#enrollMentBtn").click(function() {

                        alert("hey");

                    });
                }


            },

            async: false,

            error: function(err) {

                document.getElementById("loading").style.display = "block";

                document.getElementById("allCourses").style.display = "none";

                document.getElementById("loading").innerHTML = "Error Loading Courses";

                document.getElementById("loading").style.color = "red";

                document.getElementById("reload").style.display = "initial";

                document.getElementById("reload").innerHTML = "Reload";



            }

        });
    }
    loadCourses();

    $("#reload").click(function() {


        loadCourses();
    });
}

function loadAllTheCourses() {

    e = $(".courseCard");

    document.getElementById("courseCard").style.display = "none";

    document.getElementById("error").style.display = "block";


    const urlLink = "https://secsoftincapi.herokuapp.com/courses";

    $.ajax({

        url: urlLink,

        type: "GET",

        success: function(data, status) {

            document.getElementById("loader").style.display = "none";

            document.getElementById("courseCard").style.display = "block";

            document.getElementById("error").style.display = "none";

            $(".filterpreloader").css("display", "none");

            $("#courseTitle").html(data[0].title);

            $("#courseDescription").html((data[0].description).slice(0, 25));

            $("#courseCategory").html(data[0].category);

            $("#courseChapters").html(data[0].chapters);

            $("#courseDuration").html(data[0].duration);

            $("#courseImage").attr("src", data[0].image);

            $("#courseUrl").innerHTML = data[0].category;

            $("#skill_level").html(data[0].skill_level);

            $("#coursePrice").html("$" + data[0].course_fee);

            $("#courseUrl").attr("href", "https://secsoftinc.com/elearning/course-intro/?code=" + data[0].unique_code);

            for (i = 1; i < data.length; i++) {

                e.clone().insertAfter(e)

                .attr("class", "newCourseCard");

                $("#skill_level").html(data[i].skill_level);

                $("#coursePrice").html("$" + data[i].course_fee);

                $("#courseUrl").innerHTML = data[i].category;

                $("#courseTitle").html(data[i].title);

                $("#courseDescription").html((data[i].description).slice(0, 100));

                $("#courseCategory").html(data[i].category);

                $("#courseChapters").html(data[i].chapters);

                $("#courseDuration").html(data[i].duration);

                $("#courseImage").attr("src", data[i].image);

                $("#courseUrl").attr("href", "https://secsoftinc.com/elearning/course-intro/?code=" + data[i].unique_code);

            }
        },
        async: false,

        error: function(err) {

            document.getElementById("loader").style.display = "none";

            document.getElementById("courseCard").style.display = "none";

            document.getElementById("error").style.display = "block";

            document.getElementById("error").innerHTML = "Error while loading all courses";

            document.getElementById("error").style.color = "red";

            $(".filterpreloader").css("display", "none");

        }
    });
}

function sendFeedBack() {

    $('.loading').on('click', function() {
        //function sendForm(){
        var $btn = $(this);

        $btn.button('loading');

        document.getElementById("sendmessage").style.display = "none";

        document.getElementById("submitBtn").innerHTML = "Submitting..";

        Email = document.getElementById('email').value;

        Name = document.getElementById('name').value;

        Subject = document.getElementById('subject').value;

        Message = document.getElementById('message').value;

        if (Email.length > 0 && Name.length > 0 && Subject.length > 0 && Message.length > 0) {

            const urlLink = "https://secsoftincapi.herokuapp.com/feedback";

            const dataObject = {

                name: Name,

                email: Email,

                subject: Subject,

                message: Message

            }

            axios({

                method: 'POST',

                url: urlLink,

                data: dataObject

            })

            .then(function(response) {

                    if (response.data.msg == "Feedback received. Thank you.") {

                        document.getElementById("sendmessage").style.display = "inline";

                        $btn.button('reset');

                        document.getElementById("submitBtn").innerHTML = "Send Message";

                        document.querySelector(".contactForm").reset();

                    }

                })
                .catch((err) => {

                    document.getElementById("sendmessage").innerHTML = "Sorry, an error occurred while sending your feedback";

                    $btn.button('reset');

                    document.getElementById("submitBtn").innerHTML = "Send Message";

                    document.querySelector(".contactForm").reset();

                })
        }
    });

}

function controlHomePage() {

    document.getElementById("body-page").style.display = "none";

    document.getElementById("in").style.display = "none";

    document.getElementById("out").style.display = "block";

    document.getElementById("user").style.display = "none";

    var userTitle = document.getElementById("user-title");


    const formData = new FormData();

    formData.append('token', getCookie());

    const urlLink = "https://secsoftincapi.herokuapp.com/user";

    axios({
            method: 'POST',

            body: formData,

            data: formData,

            url: urlLink

        })
        .then(function(response) {

            document.getElementById("body-page").style.display = "initial";

            document.getElementById("loader").style.display = "none";

            document.getElementById("in").style.display = "block";

            document.getElementById("out").style.display = "none";

            document.getElementById("user").style.display = "block";

            userTitle.title = response.data.email;
        })
        .catch(function(err) {

            document.getElementById("body-page").style.display = "initial";

            document.getElementById("loader").style.display = "none";

            document.getElementById("in").style.display = "none";

            document.getElementById("out").style.display = "block";

            document.getElementById("user").style.display = "none";
        })

}

function addCourse() {

    $("#addCourse").on('submit', function(event) {

        event.preventDefault();

        document.getElementById("next").innerHTML = "Submitting...";

        var today = new Date();

        var dd = today.getDate();

        var mm = today.getMonth() + 1;

        var yyyy = today.getFullYear();

        if (dd < 10) {

            dd = '0' + dd;

        }

        if (mm < 10) {

            mm = '0' + mm;

        }

        today = yyyy + '/' + mm + '/' + dd;

        const formData = new FormData();
        formData.append('token', getCookie());

        formData.append('courseTitle', document.getElementById("courseTitle").value);

        formData.append('courseCategory', document.getElementById("courseCategory").value);

        // formData.append('no_of_participants', document.getElementById("no_of_participants").value);

        formData.append('courseDescription', document.getElementById("courseDescription").value);

        formData.append('courseObjectives', document.getElementById("courseObjectives").value);

        formData.append('no_of_chapters', document.getElementById("no_of_chapters").value);

        formData.append('certification_fee', document.getElementById("certification_fee").value);

        formData.append('enrollment_fee', document.getElementById("enrollment_fee").value);

        formData.append('prerequisites', document.getElementById("prerequisites").value);

        formData.append('unique_code', document.getElementById("uniqueCode1").value);

        formData.append('duration', document.getElementById("duration").value);

        formData.append('image', document.getElementById("image").files[0]);

        formData.append('skill_level', document.getElementById("skill_level").value);

        if (document.getElementById("coupon1").value.length > 0 && document.getElementById("off1").value.length > 0) {

            if (document.getElementById("exp1").value.length > 0) {

                formData.append('coupon_code_1[exp]', "2020/10/10");

            } else if (document.getElementById("exp11").value.length > 0) {

                formData.append('coupon_code_1[students]', document.getElementById("exp11").value);

                formData.append('coupon_code_1[exp]', today);
            }

            formData.append('coupon_code_1[percentage_off]', document.getElementById("off1").value);

            formData.append('coupon_code_1[code]', document.getElementById("coupon1").value);

        }

        if (document.getElementById("coupon2").value.length > 0 && document.getElementById("off2").value.length > 0) {

            if (document.getElementById("exp2").value.length > 0) {

                formData.append('coupon_code_2[exp]', document.getElementById("exp2").value);

            } else if (document.getElementById("exp22").value.length > 0) {

                formData.append('coupon_code_2[students]', document.getElementById("exp22").value);

                formData.append('coupon_code_2[exp]', today);

            }

            formData.append('coupon_code_2[percentage_off]', document.getElementById("off2").value);

            formData.append('coupon_code_2[code]', document.getElementById("coupon2").value);

        }

        if (document.getElementById("coupon3").value.length > 0 && document.getElementById("off3").value.length > 0) {

            if (document.getElementById("exp3").value.length > 0) {

                formData.append('coupon_code_3[exp]', document.getElementById("exp3").value);

            } else if (document.getElementById("exp33").value.length > 0) {

                formData.append('coupon_code_3[students]', document.getElementById("exp33").value);

                formData.append('coupon_code_3[exp]', today);
            }

            formData.append('coupon_code_3[percentage_off]', document.getElementById("off3").value);

            formData.append('coupon_code_3[code]', document.getElementById("coupon3").value);

        }

        if (document.getElementById("courseTitle").value.length > 0) {

            document.getElementById("next").innerHTML = "Submitting...";

            document.getElementById("feedBack").innerHTML = "";

            const urlLink = "https://secsoftincapi.herokuapp.com/createcourse";

            axios({

                method: 'POST',

                url: urlLink,

                data: formData

            })

            .then(function(response) {


                if (response.status == 200) {

                    document.getElementById("feedBack").innerHTML = response.data.message + "..redirecting to course contents";

                }

                // localStorage.setItem("courseTitle", document.getElementById("courseTitle").value);

                // localStorage.setItem("courseCode", document.getElementById("uniqueCode1").value);

                document.getElementById("next").innerHTML = "Success";

                urlRedirect = "../preview-added-course/?code=" + document.getElementById("uniqueCode1").value;

                location.replace(urlRedirect);


            })

            .catch(function(err) {

                if (err.message == "Network Error") {

                    document.getElementById("feedBack").innerHTML = "Sorry, an error was encountered";

                } else if (err.response.data.message == ("E11000 duplicate key error collection: secsoftinc.courses index: unique_code_1 dup key: { : " + document.getElementById("uniqueCode1").value + " }")) {

                    document.getElementById("feedBack").innerHTML = "Sorry, the Course Code Already Exists";

                } else if (err.response.data.msg == "Unathorized. Kindly login to proceed.") {

                    document.getElementById("feedBack").innerHTML = err.response.data.msg;
                } else {

                    document.getElementById("feedBack").innerHTML = "Sorry, an error was encountered";
                }
                document.getElementById("next").innerHTML = "Retry";

            });

        } else {

            event.preventDefault();

            document.getElementById("feedBack").innerHTML = "Incomplete Fields";

            document.getElementById("next").innerHTML = "Submit";


        }

    });

}

function course_intro() {

    pageUrl = window.location.href;

    courseCode = pageUrl.split("?code=")[1];

    document.getElementById("page-content").style.display = "initial";

    document.getElementById("page-content-error").style.display = "none";

    const urlLink = "https://secsoftincapi.herokuapp.com/course/" + courseCode;

    task = $(".task");

    chapter = $(".cloneChapters");

    $.ajax({

        url: urlLink,

        type: "GET",

        success: function(response, status) {
            //document.getElementById("loader").style.display = "none";
            document.getElementById("courseTitle").innerHTML = response.title;

            document.getElementById("courseDescription").innerHTML = response.description;

            document.getElementById("courseTitle1").innerHTML = response.title;

            document.getElementById("courseDescription1").innerHTML = response.description;

            document.getElementById("no_of_participants").innerHTML = response.no_of_participants;

            document.getElementById("coursePrice").innerHTML = response.course_fee;

            document.getElementById("certPrice").innerHTML = response.certification_fee;

            document.getElementById("chapters").innerHTML = response.chapters;

            document.getElementById("duration").innerHTML = response.duration + " minutes";

            document.getElementById("skillLevel").innerHTML = response.skill_level;

            document.getElementById("category").innerHTML = response.category;

            document.getElementById("courseCode").innerHTML = response.unique_code;

            document.getElementById("description").innerHTML = response.description;

            document.getElementById("objectives").innerHTML = response.objectives;

            document.getElementById("prerequisites").innerHTML = response.prerequisites;

            if (response.course_details.course_fee == 0) {

                document.getElementById("courseLabel").innerHTML = "This course is free but may require certification fee which is optional to select below!";
            }

            if (response.course_details.length > 1) {

                document.getElementById("chapter1").innerHTML = response.course_details[0]['title'];

                document.getElementById("outline1").innerHTML = response.course_details[0]['outline'];

            }

            document.getElementById("chapter2").style.display = "none";

            document.getElementById("outline2").style.display = "none";



            //chapter = $(".cloneChapters");


            document.getElementById("task-clone").style.display = "none";

            document.getElementById("taskNo").style.display = "none";

            for (t = response.course_details.length - 1; t >= 0; t--) {

                task.clone().insertAfter(task);

                document.getElementById("task-clone").innerHTML = response.course_details[t]['task'];

                document.getElementById("taskNo").innerHTML = "Task" + " " + (t + 1);

                document.getElementById("taskNo").style.display = "block";

                document.getElementById("task-clone").style.display = "block";

            }

            for (c = response.course_details.length - 1; c >= 1; c--) {

                chapter.clone().insertAfter(chapter);

                d = c - 1;

                chap = "chapter" + c;

                document.getElementById("chapter2").innerHTML = response.course_details[c]['title'];

                document.getElementById("outline2").innerHTML = response.course_details[c]['outline'];

                document.getElementById("chapter2").style.display = "block";

                document.getElementById("outline2").style.display = "block";
            }

            if (response.certification_fee != 0) {

                document.getElementById("certification").innerHTML = "Yes";

            }

            document.getElementById("courseIcon").src = response.image;

            document.getElementById("course_image").src = response.image;

            if ((parseInt(response.certification_fee) + parseInt(response.course_fee)) == 0) {

                document.getElementById("paidBox").style.display = "none";

            } else {

                document.getElementById("certFee").innerHTML = response.certification_fee;

                document.getElementById("courseFee").innerHTML = response.course_fee;

                document.getElementById("totalFee").innerHTML = parseInt(response.certification_fee) + parseInt(response.course_fee);

                document.getElementById("enrollNow").innerHTML = "PAY NOW";

            }
            //document.getElementById("")
        },
        async: false,

        error: function(err) {

            if (err.statusText == "error") {

                document.getElementById("error-msg").innerHTML = "Sorry, an error was encountered due to poor network";
            }
            document.getElementById("page-content").style.display = "none";

            document.getElementById("page-content-error").style.display = "block";

        }
    });
}


function updateCourseChapter(title, chapNo, chapButton, courseCode, option) {

    const urlLink = "https://secsoftincapi.herokuapp.com/course/" + courseCode;

    chapButton.innerHTML = "updating...";

    const formData = new FormData();

    if (option == "chapter") {

        formData.append('title', title);

    } else if (option == "material") {

        formData.append('material', title);

    } else if (option == "outline") {

        formData.append('outline', title);

    } else if (option == "task") {

        formData.append('task', title);

    } else if (option == "document") {

        formData.append("document", title);
        console.log("updating as document");

    }

    formData.append('chapter', chapNo);

    formData.append('token', getCookie());

    axios({

        method: 'POST',

        url: urlLink,

        data: formData,

        body: formData

    })

    .then(function(response) {

            chapButton.innerHTML = "Re-Update";
            console.log(response)

        })
        .catch(function(err) {

            chapButton.innerHTML = "Retry";

            if (err.message == "Network Error") {

                alert("Sorry, an error was encountered due to Network");

            } else {

                alert("Sorry, an errro was encountered while updating");

            }

        });
}

function preview() {

    pageUrl = window.location.href;

    courseCode = pageUrl.split("?code=")[1];

    const urlLink = "https://secsoftincapi.herokuapp.com/course/" + courseCode;

    document.getElementById("courseTitle").innerHTML = "Fetching course contents...";

    axios({

        method: 'GET',

        url: urlLink

    })

    .then(function(response) {

        for (c = 0; c < response.data.course_details.length; c++) {

            d = c + 1;

            chap = "chapter" + d;

            mat = "material" + d;

            out = "outline" + d;

            task = "task" + d;

            document.getElementById(chap).innerHTML = response.data.course_details[c]['title'];

            document.getElementById(mat).value = response.data.course_details[c]["material"];

            document.getElementById(out).value = response.data.course_details[c]["outline"];

            document.getElementById(task).value = response.data.course_details[c]["task"];

        }

        for (no = 1; no <= response.data.chapters; no++) {

            n = "display-" + no;

            document.getElementById(n).style.display = "initial";

        }


        document.getElementById("courseTitle").innerHTML = response.data.title;
        console.log(response);
    })

    .catch(function(err) {

        document.getElementById("courseTitle").innerHTML = "Sorry, an error occurred due to broken link or poor Network";

        document.getElementById("courseTitle").style.color = "red";

    })
}

function fetchCourse() {

    pageUrl = window.location.href;

    courseCode = pageUrl.split("?code=")[1];

    const urlLink = "https://secsoftincapi.herokuapp.com/course/" + courseCode;

    document.getElementById("courseTitle").innerHTML = "Fetching course contents...";

    const urlLink1 = "https://secsoftincapi.herokuapp.com/confirmenrolment/" + courseCode;

    form1 = new FormData();

    form1.append("token", getCookie());

    axios({

        method: 'POST',

        body: form1,

        data: form1,

        url: urlLink1

    })

    .then(function(resp) {

            axios({

                method: 'GET',

                url: urlLink

            })

            .then(function(response) {

                const pro = "https://secsoftincapi.herokuapp.com/user";

                const formData = new FormData();

                formData.append('token', getCookie());

                axios({
                        method: 'POST',

                        body: formData,

                        data: formData,

                        url: pro

                    })
                    .then(function(response) {
                        document.getElementById("userName").innerHTML = "Welcome Back! " + response.data.firstName;

                    })
                    .catch(function(e) {
                        document.getElementById("userName").innerHTML = "Welcome Back!";
                    })

                if (resp.data.msg == "You are not enrolled for this course.") {

                    document.getElementById("courseError").innerHTML = "Sorry, you must enroll before taking course through " + "<a href='https://secsoftinc.com/elearning/course-intro/?code=" + courseCode + "'>this link</a>"
                } else {

                    document.getElementById("ErrorDiv").style.display = "none";

                    for (c = 0; c < response.data.course_details.length; c++) {

                        d = c + 1;

                        chap = "chapter" + d;

                        mat = "material" + d;

                        out = "outline" + d;

                        task = "task" + d;

                        // Check the main container is ready
                        // function createTextLinks_(text) {
                        //     var str = text;
                        //     // Set the regex string
                        //     var regex = /(https?:\/\/([-\w\.]+)+(:\d+)?(\/([\w\/_\.]*(\?\S+)?)?)?)/ig
                        //         // Replace plain text links by hyperlinks
                        //     var replaced_text = str.replace(regex, "<a href='$1' target='_blank'>$1</a>");
                        //     // Echo link
                        //     return replaced_text;
                        // }


                        // document.getElementById(chap).innerHTML = response.data.course_details[c]['title'];

                        // document.getElementById(mat).innerHTML = (response.data.course_details[c]["material"]);

                        // document.getElementById(out).innerHTML = response.data.course_details[c]["outline"];

                        // document.getElementById(task).innerHTML = response.data.course_details[c]["task"];
                        console.log(response.data.course_details[c].documents);
                        document.getElementById("module-no").innerHTML = response.data.course_details[c].documents.length;
                        if (response.data.course_details[c].documents.length > 0) {
                            modules = $(".module");
                            modulesLink = $(".module-link");
                            modulesRead = $(".module-read");
                            Reads = $(".read");


                            $("#module").html(response.data.course_details[c].documents[0].chapter);
                            for (module = 1; module < response.data.course_details[c].documents.length; module++) {
                                if (response.data.course_details[c].documents[module].hasOwnProperty("link")) {
                                    modules.clone().insertAfter(modules);

                                    modulesLink.clone().insertAfter(modulesLink);

                                    modulesRead.clone().insertAfter(modulesLink);

                                    // Reads.clone().insertAfter(Reads);

                                    $("#module").html(response.data.course_details[c].documents[module].chapter);

                                    $("#module-link").attr("href", response.data.course_details[c].documents[module].link);
                                    $("#module-read").attr("href", response.data.course_details[c].documents[module].link);
                                    newClass = "linkUrl" + module;
                                    newIds = "read" + module;
                                    console.log(document.getElementById(newIds).href)
                                    $("module-read").attr("class", newClass);
                                    Reads.attr("id", newIds);
                                    // $("#module-link").html(response.data.course_details[c].documents[module].link);

                                }

                            }

                            document.addEventListener('click', function(event) {

                                if (event.target.classList.contains('read')) {

                                    event.preventDefault();

                                    document.getElementById("material1").src = document.getElementById("module-read").href;

                                    console.log($(".read").attr("id"));
                                }

                                if (event.target.classList.contains('download')) {

                                    event.preventDefault();

                                    document.getElementById("module-read").download;

                                }

                            });



                        } else {
                            $("#module").html("No module(s) for this chapter");

                        }
                    }

                    for (no = 1; no <= response.data.chapters; no++) {

                        n = "display-" + no;

                        document.getElementById(n).style.display = "initial";

                    }

                }

                document.getElementById("courseTitle").innerHTML = response.data.title;

                document.getElementById("loader1").style.display = "none";

                document.getElementById("loader").style.display = "none";

            })

            .catch(function(err) {

                document.getElementById("loader1").style.display = "none";

                document.getElementById("loader").style.display = "none";

                document.getElementById("courseTitle").innerHTML = "Sorry, an error occurred due to broken link or poor Network";

                document.getElementById("courseTitle").style.color = "red";

            });

        })
        .catch(function(err) {

            document.getElementById("ErrorDiv").style.display = "none";

            if (err.message == "Network Error") {

                document.getElementById("userName").innerHTML = "Sorry, an error occurred due to poor Network";

                document.getElementById("courseTitle").innerHTML = "Sorry, an error occurred due to poor Network";

                document.getElementById("userName").style.color = "red";

            } else if (err.response.data.msg == "Unathorized. Kindly proceed to login.") {

                document.getElementById("userName").innerHTML = err.response.data.msg;

                document.getElementById("courseTitle").innerHTML = err.response.data.msg;

                document.getElementById("userName").style.color = "rgb(0,0,30)";

            }

        });
}

function enrollIntoCourse() {

    pageUrl = window.location.href;

    courseCode = pageUrl.split("?code=")[1];

    const urlLink = "https://secsoftincapi.herokuapp.com/confirmenrolment/" + courseCode;

    const formData = new FormData();

    formData.append('token', getCookie());

    axios({
            method: 'POST',

            body: formData,

            data: formData,

            url: urlLink

        })
        .then(function(response) {

            if (response.data.data.already_enrolled == false) {

                document.getElementById("startCourse").innerHTML = "Enroll";

                var vue = new Vue({

                    el: "#app ",

                    data: {

                        formOpen: false,

                        productData: {

                            title: " ",

                            rating: " ",

                            price: " ",

                            list_price: " ",

                            is_featured: false

                        }

                    },

                    methods: {

                        resetForm: function() {

                            this.productData = {

                                title: " ",

                                rating: " ",

                                price: " ",

                                list_price: " ",

                                is_featured: false

                            };

                        },

                        cancel: function() {

                            this.formOpen = false;

                            this.resetForm();

                        },

                        submitForm: function(event) {

                            document.getElementById("enrollNow").innerHTML = "Enrolling";

                            const urlLink = "https://secsoftincapi.herokuapp.com/enrol/" + courseCode;

                            const formData = new FormData();

                            formData.append('token', getCookie());

                            if (document.getElementById("couponCode").value.length > 0) {

                                formData.append("coupon_code", document.getElementById("couponCode").value);

                            }

                            if (document.getElementById("paymentOption").value == "certFeePay") {

                                formData.append("certInclusive", true);

                            }

                            axios({
                                    method: 'POST',

                                    body: formData,

                                    data: formData,

                                    url: urlLink

                                })
                                .then(function(response) {


                                    if (parseInt(document.getElementById("totalFee").innerHTML) == 0) {

                                        document.getElementById("enrollNow").innerHTML = "Done";

                                    } else {

                                        document.getElementById("enrollNow").innerHTML = "Paying...";

                                    }

                                    // this.formOpen = false;
                                    // this.resetForm();
                                    location.replace(response.data);

                                })
                                .catch(function(err) {

                                    document.getElementById("enrollNow").innerHTML = "RE-TRY";
                                    //}

                                })

                        },

                        validate: function(event) {

                            document.getElementById("validate").innerHTML = "validating...";

                            document.getElementById("couponValidate").innerHTML = "please wait while we validate";

                            const urlLink = "https://secsoftincapi.herokuapp.com/getcoupon/" + courseCode;

                            const formData = new FormData();

                            formData.append('token', getCookie());

                            if (document.getElementById("couponCode").value.length > 0) {

                                formData.append("coupon_code", document.getElementById("couponCode").value);

                                axios({
                                        method: 'POST',

                                        body: formData,

                                        data: formData,

                                        url: urlLink

                                    })
                                    .then(function(response) {

                                        document.getElementById("couponValidate").innerHTML = "coupon applied";

                                        document.getElementById("validate").innerHTML = "validated";

                                        document.getElementById("totalFee").innerHTML -= (parseFloat(response.data.percentage_off) / 100) * parseFloat(document.getElementById("totalFee").innerHTML);

                                    })

                                .catch(function(err) {

                                    document.getElementById("couponValidate").innerHTML = err.response.data.msg;

                                    document.getElementById("validate").innerHTML = "validate";

                                })

                            } else {

                                document.getElementById("couponValidate").innerHTML = "coupon field cannot be empty";

                                document.getElementById("validate").innerHTML = "validate";
                            }
                        },
                        paymentOption: function(event) {

                            if (document.getElementById("paymentOption").value == "courseFeePay") {

                                document.getElementById("totalFee").innerHTML = document.getElementById("courseFee").innerHTML;

                            } else {

                                document.getElementById("totalFee").innerHTML = parseFloat(document.getElementById("courseFee").innerHTML) + parseFloat(document.getElementById("certFee").innerHTML);

                            }

                            if (document.getElementById("totalFee").innerHTML == 0) {

                                if (document.getElementById("paymentOption").value == "courseFeePay") {

                                    document.getElementById("notePay").innerHTML = "You're enrolling without certifiction";

                                } else {

                                    document.getElementById("notePay").innerHTML = "You're enrolling with certification";
                                }

                                document.getElementById("enrollNow").innerHTML = "Enroll";

                            } else {

                                document.getElementById("enrollNow").innerHTML = "Pay Now";

                            }
                        }

                    }
                })
            } else {

                document.getElementById("startCourse").innerHTML = "Continue";

            }

        }).catch(function(err) {

            //if (err.response.data.msg == "Unauthorized. Kindly login to proceed.") {

            document.getElementById("startCourse").innerHTML = "Login";

            //}

        })

}

function myEnrolledCourses() {

    const urlLinkmyEnrolledCourses = "https://secsoftincapi.herokuapp.com/user";

    const formDatamyEnrolledCourses = new FormData();

    formDatamyEnrolledCourses.append('token', getCookie());

    axios({
            method: 'POST',

            body: formDatamyEnrolledCourses,

            data: formDatamyEnrolledCourses,

            url: urlLinkmyEnrolledCourses

        })
        .then(function(response) {

            document.getElementById("loader").style.display = "none";
            Message.innerHTML = "";

            document.getElementById("firstName").value = response.data.firstName;

            document.getElementById("lastName").value = response.data.lastName;

            document.getElementById("email").value = response.data.email;

            document.getElementById("phone").value = response.data.phone;

            document.getElementById("dob").value = response.data.dob;

            document.getElementById("summary").value = response.data.summary;

            document.getElementById("title").value = response.data.title;

            document.getElementById("experience").value = response.data.experience;

            document.getElementById("education").value = response.data.education;

            document.getElementById("achievements").value = response.data.achievements;

            document.getElementById("phone").value = response.data.phone;

            if (response.data.resume.length > 0) {

                document.getElementById("profileResume").href = response.data.resume;

            }

            if (response.data.portfolio.length > 0) {

                document.getElementById("profilePortfolio").href = response.data.portfolio;

                document.getElementById("profileImgDisplay").style.display = "initial";

                document.getElementById("profileImgTemp").style.display = "none"

            } else {

                document.getElementById("profileImgDisplay").style.display = "none";

                document.getElementById("profileImgTemp").style.display = "initial"

            }

            if (response.data.user_image.length > 0) {

                document.getElementById("profileImg").src = response.data.user_image;

            }

            $("#billing-card :input").prop("disabled", false);


        })
        .catch(function(err) {

            document.getElementById("loader").style.display = "none";

            Message.style.display = "block";

            Message.innerHTML = "Sorry, session expired. redirecting in 3 secs to login...";
            //document.getElementById("billing-card").disabled = true;
            $("#billing-card :input").prop("disabled", true);

            setTimeout(function() {
                window.location.href = 'https://secsoftinc.com/auth/login';
            }, 3000);
        })
}

function modifyCourses() {

    e = $(".courseCard");

    document.getElementById("courseCard").style.display = "none";

    document.getElementById("error").style.display = "block";

    const urlLink = "https://secsoftincapi.herokuapp.com/courses";

    $.ajax({

        url: urlLink,

        type: "GET",

        success: function(data, status) {

            document.getElementById("loader").style.display = "none";

            document.getElementById("courseCard").style.display = "block";

            document.getElementById("error").style.display = "none";

            $("#courseTitle").html(data[0].title);

            $("#courseDescription").html((data[0].description).slice(0, 25));

            $("#courseCategory").html(data[0].category);

            $("#courseChapters").html(data[0].chapters);

            $("#courseDuration").html(data[0].enrolled.length);

            $("#courseImage").attr("src", data[0].image);

            $("#courseUrl").innerHTML = data[0].category;

            $("#courseUrl").attr("href", "https://secsoftinc.com/elearning/course-intro/?code=" + data[0].unique_code);

            for (i = 1; i < data.length; i++) {

                e.clone().insertAfter(e);

                $("#courseUrl").innerHTML = data[i].category;

                $("#courseTitle").html(data[i].title);

                $("#courseDescription").html((data[i].description).slice(0, 100));

                $("#courseCategory").html(data[i].category);

                $("#courseChapters").html(data[i].chapters);

                $("#courseDuration").html(data[i].enrolled.length);

                $("#courseImage").attr("src", data[i].image);

                $("#courseUrl").attr("href", "https://secsoftinc.com/elearning/course-intro/?code=" + data[i].unique_code);

            }
        },
        async: false,

        error: function(err) {

            document.getElementById("loader").style.display = "none";

            document.getElementById("courseCard").style.display = "none";

            document.getElementById("error").style.display = "block";

            document.getElementById("error").innerHTML = "Error while loading all courses";

            document.getElementById("error").style.color = "red";


        }
    });
}

function fetchCourseDetails(courseCode) {

    const urlLinkCourseDetails = "https://secsoftincapi.herokuapp.com/course/" + courseCode;


    $.ajax({

        url: urlLinkCourseDetails,

        type: "GET",

        success: function(data, status) {
            output = data
        },

        async: false,

        error: function(err) {
            output = err
        }
    })
    return output
}

function loadAllMyCourses() {

    e = $(".courseCard");

    document.getElementById("courseCard").style.display = "none";

    document.getElementById("error").style.display = "block";

    const urlLink = "https://secsoftincapi.herokuapp.com/user";

    formData = {
        "token": getCookie()
    }

    $.ajax({

        url: urlLink,

        type: "POST",

        body: formData,

        data: formData,

        success: function(data, status) {

            document.getElementById("loader").style.display = "none";

            document.getElementById("courseCard").style.display = "block";

            document.getElementById("error").style.display = "none";

            if (data.enrolled.length > 0) {

                res = fetchCourseDetails(data.enrolled[0].course_unique_code)

                $("#courseTitle").html(res.title);

                $("#courseDescription").html((res.description).slice(0, 100));

                $("#courseCategory").html(res.category);

                $("#courseChapters").html(res.chapters);

                $("#courseDuration").html(res.duration);

                $("#courseImage").attr("src", res.image);

                $("#courseUrl").innerHTML = res.category;

                $("#skill_level").html(res.skill_level);

                $("#courseUrl").attr("href", "https://secsoftinc.com/elearning/course-intro/?code=" + res.unique_code);

                for (i = 1; i < data.enrolled.length; i++) {

                    e.clone().insertAfter(e);

                    res = fetchCourseDetails(data.enrolled[i].course_unique_code);

                    $("#skill_level").html(res.skill_level);

                    $("#courseTitle").html(res.title);

                    $("#courseDescription").html((res.description).slice(0, 100));

                    $("#courseCategory").html(res.category);

                    $("#courseChapters").html(res.chapters);

                    $("#courseDuration").html(res.duration);

                    $("#courseImage").attr("src", res.image);

                    $("#courseUrl").innerHTML = res.category;

                    $("#courseUrl").attr("href", "https://secsoftinc.com/elearning/course-intro/?code=" + res.unique_code);

                }

            } else {

                document.getElementById("courseCard").style.display = "none";

                document.getElementById("error").style.display = "block";

                document.getElementById("error").innerHTML = "You've not enrolled into any course yet";

                document.getElementById("error").style.color = "red";

                document.getElementById("pagination").style.display = "none";
            }
        },
        async: false,

        error: function(err) {

            document.getElementById("pagination").style.display = "none";

            document.getElementById("loader").style.display = "none";

            document.getElementById("courseCard").style.display = "none";

            document.getElementById("error").style.display = "block";

            document.getElementById("error").innerHTML = "Error while loading all courses";

            document.getElementById("error").style.color = "red";


        }
    });
}

function notifications() {

    const urlLinkNotify = "https://secsoftincapi.herokuapp.com/notifications";

    const formNotify = new FormData();

    formNotify.append('token', getCookie());

    notes = $(".noteCard");

    document.getElementById("noteCount").innerHTML = "loading notifications...";

    axios({

        method: 'POST',

        body: formNotify,

        data: formNotify,

        url: urlLinkNotify

    })

    .then(function(response) {

        if (response.data.notifications.length > 0) {

            document.getElementById("noteCount").innerHTML = response.data.notifications.length + " in total";

            document.getElementById("noteTextCard").innerHTML = response.data.notifications[0].message;

            document.getElementById("noteTimeCard").innerHTML = response.data.notifications[0].sent.slice(0, 10);

            for (no = 1; no < response.data.notifications.length; no++) {

                notes.clone().insertAfter(notes);

                document.getElementById("noteTextCard").innerHTML = response.data.notifications[no].message;

                document.getElementById("noteTimeCard").innerHTML = response.data.notifications[no].sent.slice(0, 10);

            }
        } else {

            document.getElementById("noteCount").innerHTML = "You've got no notifications yet";

        }

    })

    .catch(function(err) {

        document.getElementById("noteCard").style.display = "none";

        document.getElementById("noteCount").style.color = "red"

        if (err.response.statusText == "Not Found") {

            document.getElementById("noteCount").innerHTML = "you're not logged in";

        } else {
            document.getElementById("noteCount").innerHTML = "Sorry, an error occurred";
        }
    })

}

function messages() {

    msgCard = $(".msgCard");

    const urlLinkNotify = "https://secsoftincapi.herokuapp.com/messages";

    const formNotify = new FormData();

    formNotify.append("token", getCookie());

    document.getElementById("msgCount").innerHTML = "loading messages...";

    document.getElementById("msgCard").style.display = "none";

    axios({

            method: "POST",

            url: urlLinkNotify,

            body: formNotify,

            data: formNotify,

        })
        .then(function(response) {

            if (response.data.messages.length > 0) {

                document.getElementById("msgCard").style.display = "initial";

                document.getElementById("msgSubj").innerHTML = response.data.messages[0].subject;

                document.getElementById("msgBody").innerHTML = response.data.messages[0].body;

                document.getElementById("msgTime").innerHTML = response.data.messages[0].sent.slice(0, 10);

                document.getElementById("msgSender").innerHTML = response.data.messages[0].from.slice(0, 5);

                document.getElementById("msgCount").innerHTML = response.data.messages.length + " message(s)";

                for (msg = 1; msg < response.data.messages.length; msg++) {

                    msgCard.clone().insertAfter(msgCard);

                    document.getElementById("msgSender").innerHTML = response.data.messages[msg].from.slice(0, 5);

                    document.getElementById("msgSubj").innerHTML = response.data.messages[msg].subject;

                    document.getElementById("msgBody").innerHTML = response.data.messages[msg].body;

                    document.getElementById("msgTime").innerHTML = response.data.messages[msg].sent.slice(0, 10);
                }

            } else {

                document.getElementById("msgCount").innerHTML = "you've got no messages yet";

            }
        })
        .catch(function(err) {

            document.getElementById("msgCard").style.display = "none";

            document.getElementById("msgCount").style.color = "red"

            if (err.response.statusText == "Not Found") {

                document.getElementById("msgCount").innerHTML = "you're not logged in";

            } else {

                document.getElementById("msgCount").innerHTML = "Sorry, an error occurred";

            }

        })

}

function sendMsg() {

    const urlLinkSendMsg = "https://secsoftincapi.herokuapp.com/send/message";

    const formSendMsg = new FormData();

    formSendMsg.append('token', getCookie());

    formSendMsg.append("send_message_to", document.getElementById("recipient").value);

    formSendMsg.append("send_message_body", document.getElementById("msgBody").value);

    formSendMsg.append("send_message_subject", document.getElementById("msgSubject").value);

    if ((document.getElementById("recipient").value.length > 0) && (document.getElementById("msgBody").value.length > 0) && (document.getElementById("msgSubject").value.length > 0)) {

        document.getElementById("sendMsg").innerHTML = "Sending...";

        axios({

            method: 'POST',

            body: formSendMsg,

            data: formSendMsg,

            url: urlLinkSendMsg

        })

        .then(function(response) {

            document.getElementById("feedBack").innerHTML = "Message Sent!";

            document.getElementById("sendMsg").innerHTML = "Send Message";

        })

        .catch(function(err) {

            document.getElementById("feedBack").innerHTML = err.message;

            if (err.message == "Request failed with status code 400") {

                document.getElementById("feedBack").innerHTML = err.response.data.msg + " or check user email";

            } else {
                document.getElementById("feedBack").innerHTML = "Message Failed to send";
            }
            document.getElementById("sendMsg").innerHTML = "Send Message";
        })
    } else {

        document.getElementById("feedBack").innerHTML = "All fields must be filled";

    }
}

function sendNotify() {

    const urlNotify = "https://secsoftincapi.herokuapp.com/send/notification";

    const formNotify = new FormData();

    formNotify.append('token', getCookie());

    formNotify.append("message", document.getElementById("notification").value);

    document.getElementById("notify").innerHTML = "Sending...";

    if ((document.getElementById("notification").value.length > 0)) {

        axios({

            method: 'POST',

            body: formNotify,

            data: formNotify,

            url: urlNotify

        })

        .then(function(response) {

            document.getElementById("notify").innerHTML = "Send Note";

            document.getElementById("feedBack1").innerHTML = "Notifications sent!";

        })

        .catch(function(err) {

            if (err.response.status == 400) {

                document.getElementById("feedBack1").innerHTML = err.response.data.msg;

            } else {

                document.getElementById("feedBack1").innerHTML = "Notifications failed to send!";

            }

            document.getElementById("notify").innerHTML = "Send Note";

        })
    } else {

        document.getElementById("feedBack").innerHTML = "Field must be filled";

    }
}

function allnotifications() {

    const urlLinkNotify = "https://secsoftincapi.herokuapp.com/allnotifications";

    const formNotify = new FormData();

    formNotify.append('token', getCookie());

    notes = $(".noteCard");

    document.getElementById("noteCount").innerHTML = "loading notifications...";

    axios({

        method: 'POST',

        body: formNotify,

        data: formNotify,

        url: urlLinkNotify

    })

    .then(function(response) {

        if (response.data.notifications.length > 0) {

            document.getElementById("noteCount").innerHTML = response.data.notifications.length + " in total";

            document.getElementById("noteTextCard").innerHTML = response.data.notifications[0].message;

            document.getElementById("noteTimeCard").innerHTML = response.data.notifications[0].sent.slice(0, 10);

            for (no = 1; no < response.data.notifications.length; no++) {

                notes.clone().insertAfter(notes);

                document.getElementById("noteTextCard").innerHTML = response.data.notifications[no].message;

                document.getElementById("noteTimeCard").innerHTML = response.data.notifications[no].sent.slice(0, 10);

            }
        } else {

            document.getElementById("noteCount").innerHTML = "You've got no notifications yet";

        }

    })

    .catch(function(err) {

        document.getElementById("noteCard").style.display = "none";

        document.getElementById("noteCount").style.color = "red"

        if (err.response.statusText == "Not Found") {

            document.getElementById("noteCount").innerHTML = "you're not logged in";

        } else {
            document.getElementById("noteCount").innerHTML = "Sorry, an error occurred";
        }
    })

}

function allmessages() {

    msgCard = $(".msgCard");

    const urlLinkNotify = "https://secsoftincapi.herokuapp.com/allmessages";

    const formNotify = new FormData();

    formNotify.append("token", getCookie());

    document.getElementById("msgCount").innerHTML = "loading messages...";

    document.getElementById("msgCard").style.display = "none";

    axios({

            method: "POST",

            url: urlLinkNotify,

            body: formNotify,

            data: formNotify,

        })
        .then(function(response) {

            if (response.data.messages.length > 0) {

                document.getElementById("msgCard").style.display = "initial";

                document.getElementById("msgSubj").innerHTML = response.data.messages[0].subject;

                document.getElementById("msgBody").innerHTML = response.data.messages[0].body;

                document.getElementById("msgTime").innerHTML = response.data.messages[0].sent.slice(0, 10);

                document.getElementById("msgSender").innerHTML = response.data.messages[0].from.slice(0, 5);

                document.getElementById("msgCount").innerHTML = response.data.messages.length + " message(s)";

                for (msg = 1; msg < response.data.messages.length; msg++) {

                    msgCard.clone().insertAfter(msgCard);

                    document.getElementById("msgSender").innerHTML = response.data.messages[msg].from.slice(0, 5);

                    document.getElementById("msgSubj").innerHTML = response.data.messages[msg].subject;

                    document.getElementById("msgBody").innerHTML = response.data.messages[msg].body;

                    document.getElementById("msgTime").innerHTML = response.data.messages[msg].sent.slice(0, 10);
                }

            } else {

                document.getElementById("msgCount").innerHTML = "you've got no messages yet";

            }
        })
        .catch(function(err) {

            document.getElementById("msgCard").style.display = "none";

            document.getElementById("msgCount").style.color = "red"

            if (err.response.statusText == "Not Found") {

                document.getElementById("msgCount").innerHTML = "you're not logged in";

            } else {

                document.getElementById("msgCount").innerHTML = "Sorry, an error occurred";

            }

        })

}

function checkIfEnrolled() {

    pageUrl = window.location.href;

    courseCode = pageUrl.split("?code=")[1];

    const urlLink1 = "https://secsoftincapi.herokuapp.com/confirmenrolment/" + courseCode;

    form1 = new FormData();

    form1.append("token", getCookie());

    axios({

        method: 'POST',

        body: form1,

        data: form1,

        url: urlLink1

    })

    .then(function(resp) {
            document.getElementById("startCourse").innerHTML = "Continue";
        })
        .catch(function(err) {

            document.getElementById("startCourse").innerHTML = "Enroll";

        })
}

stack = 0;
queue = {};

function search() {

    searchResults = $(".searchResults");

    const urlLinkSearch = "https://secsoftincapi.herokuapp.com/search/";

    formSearch = {

        "query": document.getElementById("searchItem").value

    }

    con = 0;

    if (stack > 0) {

        for (rem = 1; rem < stack; rem++) {

            ids = "#" + queue[rem - 1];

            $("#searchResults").html("");

            $(ids).remove();

            con += 1;

            // queue[rem - 1] = "";

        }

        con += 1;

    }

    if (con == (stack)) {

        $.ajax({

            body: formSearch,

            data: formSearch,

            url: urlLinkSearch,

            type: "POST",

            success: function(response, status) {

                if (response.length > 0) {

                    document.getElementById("searchResults").style.color = "black";

                    document.getElementById("searchResults").innerHTML = response[0].title;

                    document.getElementById("searchResults").href = "https://secsoftinc.com/elearning/course-intro/?code=" + response[0].unique_code;

                    for (sea = 1; sea < response.length; sea++) {

                        ids = "resultId" + response[sea].unique_code;
                        queue[sea - 1] = ids;

                        searchResults.clone().appendTo(".dropdown-search-list")

                        .attr("id", ids)

                        document.getElementById("searchResults").innerHTML = response[sea].title;

                        document.getElementById("searchResults").href = "https://secsoftinc.com/elearning/course-intro/?code=" + response[sea].unique_code;

                    }
                    stack = response.length;

                } else {

                    document.getElementById("searchResults").innerHTML = "No match results found";

                    document.getElementById("searchResults").style.color = "red";

                    document.getElementById("searchResults").href = "";

                }

            },

            async: false,

            error: function(err) {

                console.log(err)
            }
        });

    }
}

function searchMobile() {

    const urlLinkSearchMobile = "https://secsoftincapi.herokuapp.com/search/";

    formSearchMobile = {

        "query": document.getElementById("searchItemMobile").value

    }

    $.ajax({

        body: formSearchMobile,

        data: formSearchMobile,

        url: urlLinkSearchMobile,

        type: "POST",

        success: function(response, status) {
            console.log(response);
        },
        error: function(err) {

            console.log(err)
        }
    });

}

function queryFilter(queryString) {

    q = $(".newCourseCard");

    q.empty();

    eNew = $(".courseCard");

    document.getElementById("courseCard").style.display = "none";

    $(".filterpreloader").css("display", "initial");

    document.getElementById("allCourses").innerHTML = "Filtering Coureses...";

    const urlLinkSearch = "https://secsoftincapi.herokuapp.com/searchfilter/";

    // allChildNodes = $("#newCourseCard").empty();

    formSearch = queryString;

    $.ajax({

        body: formSearch,

        data: formSearch,

        url: urlLinkSearch,

        type: "POST",

        success: function(data, status) {

            $(".filterpreloader").css("display", "none");

            document.getElementById("allCourses").innerHTML = "Filtered Coureses";

            if (data.length > 0) {

                document.getElementById("courseCard").style.display = "initial";

                document.getElementById("loader").style.display = "none";

                document.getElementById("courseCard").style.display = "block";

                document.getElementById("error").style.display = "none";

                $("#courseTitle").html(data[0].title);

                $("#courseDescription").html((data[0].description).slice(0, 25));

                $("#courseCategory").html(data[0].category);

                $("#courseChapters").html(data[0].chapters);

                $("#courseDuration").html(data[0].duration);

                $("#courseImage").attr("src", data[0].image);

                $("#courseUrl").innerHTML = data[0].category;

                $("#skill_level").html(data[0].skill_level);

                $("#coursePrice").html(data[0].course_fee);


                $("#courseUrl").attr("href", "https://secsoftinc.com/elearning/course-intro/?code=" + data[0].unique_code);

                for (i = 1; i < data.length; i++) {

                    eNew.clone().insertAfter(eNew)

                    .attr("class", "newCourseCard");

                    $("#skill_level").html(data[i].skill_level);

                    $("#courseUrl").innerHTML = data[i].category;

                    $("#courseTitle").html(data[i].title);

                    $("#courseDescription").html((data[i].description).slice(0, 100));

                    $("#courseCategory").html(data[i].category);

                    $("#courseChapters").html(data[i].chapters);

                    $("#courseDuration").html(data[i].duration);

                    $("#courseImage").attr("src", data[i].image);

                    $("#coursePrice").html(data[i].course_fee);

                    $("#courseUrl").attr("href", "https://secsoftinc.com/elearning/course-intro/?code=" + data[i].unique_code);
                }
            } else {
                document.getElementById("loader").style.display = "none";

                document.getElementById("courseCard").style.display = "none";

                document.getElementById("error").style.display = "block";

                document.getElementById("error").innerHTML = "No filtered results";

                document.getElementById("error").style.color = "red";

                $(".filterpreloader").css("display", "none");

            }
        },

        async: false,

        error: function(err) {

            document.getElementById("allCourses").innerHTML = "Filtered Coureses";

            document.getElementById("loader").style.display = "none";

            document.getElementById("courseCard").style.display = "none";

            document.getElementById("error").style.display = "block";

            document.getElementById("error").innerHTML = "Error while loading all filtered courses";

            document.getElementById("error").style.color = "red";

            $(".filterpreloader").css("display", "none");

        }

    });

}

function free() {

    queryFilter({ "course_type": "free" });

}

function paid() {

    queryFilter({ "course_type": "paid" });

}

function web() {

    queryFilter({ "course_category": "Web" });

}

function cybersecurity() {

    queryFilter({ "course_category": "Cybersecurity" });

}

function mobile() {

    queryFilter({ "course_category": "Mobile" });

}

function beginner() {

    queryFilter({ "skill_level": "Beginner" });

}

function intermediate() {

    queryFilter({ "skill_level": "Intermediate" });

}

function expert() {

    queryFilter({ "skill_level": "Expert" });

}

function hotEnrollNow() {
    enrollHotest
    axios({

        method: 'GET',

        url: "https://secsoftincapi.herokuapp.com/mostpopularcourses"

    })

    .then(function(response1) {

        if (response1.data.length > 0) {

            document.getElementById("enrollHotest").href = "https://secsoftinc.com/elearning/course-intro?code=" + response1.data[0].unique_code;

            document.getElementById("hottestCourse").innerHTML = response1.data[0].title;

        } else {

            document.getElementById("hottestCourse").innerHTML = "Up coming!";

            document.getElementById("enrollHotest").href = "https://secsoftinc.com/elearning/all-courses";
        }

    })

    .catch(function(err) {

        document.getElementById("enrollHotest").innerHTML = "Upcoming!";

    })

}

function countDown() {


    var deadline = new Date("mar 31, 2020 23:59:60").getTime();

    var x = setInterval(function() {

        var now = new Date().getTime();

        var t = deadline - now;

        var days = Math.floor(t / (1000 * 60 * 60 * 24));

        var hours = Math.floor((t % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

        var minutes = Math.floor((t % (1000 * 60 * 60)) / (1000 * 60));

        var seconds = Math.floor((t % (1000 * 60)) / 1000);

        document.getElementById("day").innerHTML = days;

        document.getElementById("hour").innerHTML = hours;

        document.getElementById("minute").innerHTML = minutes;

        document.getElementById("second").innerHTML = seconds;

        if (t < 0) {

            clearInterval(x);

            document.getElementById("demo").innerHTML = "TIME UP FOR ENROLLMENT!";

            document.getElementById("day").innerHTML = '0';

            document.getElementById("hour").innerHTML = '0';

            document.getElementById("minute").innerHTML = '0';

            document.getElementById("second").innerHTML = '0';

            document.getElementById("enrollHotest").href = "";

            document.getElementById("enrollHotest").disabled = true;

        }

    }, 1000);

}