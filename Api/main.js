const http = require('http');
const nodemailer = require('nodemailer');

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
            // console.log(heightCm)

            // console.log(calculateCalsOutOfFoods(foods))
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

            const category = categoryCaloriesIntake(totalCals, bmr);

            if (category === 'very high') {
                sendTrashTalkEmail(email, totalCals, bmr);
            } else {
                sendEmail(email, category, totalCals, bmr);
            }

            const bodyRes = {
                message: totalCals > bmr ? `You are in a caloric surplus of ${(totalCals - bmr)}` : `You are in a caloric deficit of ${(bmr - totalCals)}`,
                calories : totalCals,
                bmr : bmr,
                category: category
            }
            res.end(JSON.stringify(bodyRes));
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

function sendEmail(email, category, totalCals, bmr) {
    let subject;
    let message;

    switch (category) {
        case 'very low':
            subject = 'Very Low Caloric Intake';
            message = `You are in a very low caloric intake of ${totalCals - bmr} calories out of a bmr of ${bmr}.`;
            break;
        case 'low':
            subject = 'Low Caloric Intake';
            message = `You are in a low caloric intake of ${totalCals - bmr} calories out of a bmr of ${bmr}.`;
            break;
        case 'normal':
            subject = 'Normal Caloric Intake';
            message = `You are in a normal caloric intake of ${totalCals - bmr} calories out of a bmr of ${bmr}.`;
            break;
        case 'high':
            subject = 'High Caloric Intake';
            message = `You are in a high caloric intake of ${totalCals - bmr} calories out of a bmr of ${bmr}.`;
            break;
        default:
            subject = 'Caloric Intake';
            message = `Your caloric intake is ${totalCals} calories out of a bmr of ${bmr}.`;
            break;
    }


    const mailOptions = {
        from: 'esteban.bare@laplateforme.io',
        to: email,
        subject: subject,
        text: message
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

function sendTrashTalkEmail(email,totalCals, bmr) {
    const messages = [
        {
            subject: "Piece of SHIT, way too many calories",
            text: `You consumed ${totalCals} cals! Thats way more that your bmr ${bmr}`
        },
        {
            subject: "Are you serious? Overeating much?",
            text: `Your intake of ${totalCals} calories is absurd compared to your bmr of ${bmr}. Get it together!`
        },
        {
            subject: "Calorie overload detected!",
            text: `Wow, ${totalCals} calories? That's way beyond your bmr of ${bmr}. Time to rethink your choices.`
        },
        {
            subject: "Unbelievable calorie consumption!",
            text: `You managed to consume ${totalCals} calories, completely ignoring your bmr of ${bmr}. Impressive, but not in a good way.`
        },
    ]

    sendCustomEmail(email, messages[0].subject, messages[0].text);

    [15, 30, 60].forEach((delay,index) => {
        setTimeout(() => {
            sendCustomEmail(email, messages[index + 1].subject, messages[index + 1].text);
        }, delay * 1000);
    })
}

function sendCustomEmail(email, subject, text) {
    const mailOptions = {
        from: 'esteban.bare@laplateforme.io',
        to: email,
        subject: subject,
        text: text
    };

    transporter.sendMail(mailOptions, function(error, info) {
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

function categoryCaloriesIntake(totalCals, bmr) {
    const diff = totalCals - bmr;
    const percentage = (diff / bmr) * 100;

    if (percentage < -20) {
        return 'very low';
    }
    else if (percentage < -10) {
        return 'low';
    }
    else if (percentage < 10) {
        return 'normal';
    }
    else if (percentage < 20) {
        return 'high';
    }
    else {
        return 'very high';
    }
}