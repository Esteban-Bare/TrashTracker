const userForm = document.querySelector(".user_info");
const addfood = document.querySelector(".aliment");

let list = [];




addfood.addEventListener("submit", (event) => { //fonctionne
    event.preventDefault(); // IMPORTANT pour ne pas recharger la page
    const userfood = new FormData(event.target);

    const newfood = {
        aliment: userfood.get("food_search"),
        quantite: userfood.get("food_quantity")
    };
  list.push(newfood);
    console.log(list)
});

userForm.addEventListener("submit", (event) => {///fonctionne
    event.preventDefault(); // IMPORTANT pour ne pas recharger la page

    const userInfos = new FormData(event.target);

    const user = {
        email: userInfos.get("email"),
        weight: userInfos.get("weight"),
        height: userInfos.get("height"),
        age: userInfos.get("age"),
        gender: userInfos.get("gender")
    };
});
