var http = require('http');
var nodemailer = require('nodemailer');

http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    if (req.url === '/send-email' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', async () => {
            const reqBody = JSON.parse(body);
            const email = reqBody.user.email;
            const gender = reqBody.user.gender;
            const weightKg = parseFloat(reqBody.user.weight); // Convert to number
            const heightCm = parseFloat(reqBody.user.height) * 100; // Convert to number
            const age = parseInt(reqBody.user.age); // Convert to integer
            const foods = reqBody.foods;
            console.log(heightCm)

            console.log(calculateCalsOutOfFoods(foods))
            const totalCals = await calculateCalsOutOfFoods(foods).then(
                (result) => {
                    console.log(result);
                    return result;
                }
            ).catch((error) => {
                    console.error('Error:', error);
                }
            );
            const bmr = calculateBMR(gender, weightKg, heightCm, age);
            if (totalCals > bmr) {
                const body = {
                    message : 'You are in a caloric surplus of ' + (totalCals - bmr) + ' calories.',
                    calories : totalCals,
                }
                res.end(JSON.stringify(body));
            } else {
                const body = {
                    message : 'You are in a caloric deficit of ' + (bmr - totalCals) + ' calories.',
                    calories : totalCals,
                }
                res.end(JSON.stringify(body));
            }
            console.log(reqBody)
            // sendEmail(email);
        });
    } else {
        res.end('Welcome to the server!');
    }
}).listen(8080);

console.log("Server is running at http://localhost:8080/");

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'esteban.bare@laplateforme.io',
        pass: 'bsoljvsbxqktdsal'
    }
});

function sendEmail(email) {
    const mailOptions = {
        from: 'esteban.bare@laplateforme.io',
        to: email,
        subject: 'Welcome to LaPlateforme',
        text: 'Hello, welcome to LaPlateforme! We are glad to have you here.'
    }
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

function calculateBMR(gender, weight, height, age) {
    let bmr;
    if (gender === '1') {
        bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else if (gender === '2') {
        bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    } else {
        throw new Error("Gender must be 1 or 2");
    }
    return bmr;
}

async function calculateCalsOutOfFoods(foods) {
    query = "";
    foods.forEach(food => {
        query += food.quantity + " " + food.aliment + " ";
    });

    const response = await fetch("https://trackapi.nutritionix.com/v2/natural/nutrients", {
        method: 'POST',
        headers: {
            'x-app-id': 'f90ac08e',
            'x-app-key': 'f8ef6bcd6e449c4daa31e4c723f41a2c',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            query: query,
        })
    });

    const data = await response.json();

    let totalCalories = 0;
    data.foods.forEach(food => {
        totalCalories += food.nf_calories;
    });

    return totalCalories;
}