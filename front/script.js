const { Json } = require("sequelize/lib/utils");

const userForm = document.querySelector(".user_info");
const addfood = document.querySelector(".aliment");
const divlist = document.querySelector(".list");
const submitg = document.querySelector(".submitg");
let list = [];
const data = {};



addfood.addEventListener("submit", (event) => { //fonctionne
    event.preventDefault(); // IMPORTANT pour ne pas recharger la page
    const userfood = new FormData(event.target);

    const newfood = {
        aliment: userfood.get("food_search"),
        quantity: userfood.get("food_quantity")
    };
    const newitem = document.createElement("p");
    newitem.innerText = `${newfood.aliment} - ${newfood.quantity}`;
    divlist.appendChild(newitem);

    list.push(newfood);
    console.log(list);
    data.foods = list;
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
    data.user = user
});

 submitg.addEventListener("submit", async (event) =>  {///fonctionne
    event.preventDefault(); // IMPORTANT pour ne pas recharger la page

    console.log(data);
    const res = await fetch("http://localhost:8080/send-email", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    const resData = await res.json();
    console.log(resData)
});


