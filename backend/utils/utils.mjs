const emailForm = (name, email, concern, concernDetails, referredRes, recommend) => {
    let htmlTop = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="robots" content="noindex, nofollow">
    <title>Mi Nguyen</title>
    <link rel='stylesheet' type='text/css' media='screen' href='main.css'>
    <script src='main.js'></script>
</head>
<body>
    <header>
        <h1>Mi Nguyen</h1>
    </header>
    <nav class="nav-bar">
        <a href="index.html">Home</a>
        <a href="gallery.html">Gallery</a>
        <a href="contact.html">Contact</a>
    </nav>
    <main>
`;

    let htmlBottom = `
</main>
<footer>
    <p>
        &copy; 2023 Mi Nguyen
    </p>
</footer>
</body>
</html>
`;

    return `
${htmlTop}
<section>
<h2>
    Thank you for the feedback, ${name}!
</h2>
<p>
    We will get in touch with you shortly... In the meantime, below is a copy of your response to our contact form.
</p>
<p>
    Your name is <strong>${name}</strong> and your email is <strong>${email}</strong>. You have informed us of your concern about <strong>${concern}</strong>, with the details as follows: <strong>${concernDetails}</strong>.  You have heard about us through <strong>${referredRes}</strong>. You have also indicated that you <strong>${recommend}</strong>.
</p>
</section>
${htmlBottom}
`
};

const transformSchemaJSON = (schema) => {
    schema.set('toJSON', {
        transform: (document, returnedObject) => {
            returnedObject.id = returnedObject._id.toString()
            delete returnedObject._id
            delete returnedObject.__v
        }
    })
};


export { emailForm, transformSchemaJSON };