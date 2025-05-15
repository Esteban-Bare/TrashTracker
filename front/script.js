const user_btn = document.getElementById('user_submit');


const tab = await getinfo();

user_btn.addEventListener("click",getinfo);
console.log(tab);

function getinfo() {
    const mail = document.getElementById('email').value;
    const weight = document.getElementById('weight').value;
    const gender = document.getElementById('gender').value;
    const height = document.getElementById('height').value;
    console.log(mail);
    console.log(weight);
    console.log(gender);
    console.log(height)

}   