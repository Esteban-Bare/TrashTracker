const userForm = document.querySelector(".user_info");








userForm.addEventListener("submit", (event) => {
    event.preventDefault(); // IMPORTANT pour ne pas recharger la page

    const userInfos = new FormData(event.target);

    const user = {
        email: userInfos.get("email"),
        weight: userInfos.get("weight"),
        height: userInfos.get("height"),
        age: userInfos.get("age"),
        gender: userInfos.get("gender")
    };

    console.log(user);
});
