

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
var _ = require('lodash');
const mongoose = require('mongoose')
require('dotenv').config({ path: '.env' });

const homeStartingContent = `A personal diary is a cherished companion that holds the essence of one's thoughts, experiences, and emotions. It serves as a trusted confidant, a vessel for self-reflection, and a timeless record of our lives. Within the pages of a personal diary, we find solace, clarity, and the freedom to express ourselves without judgment.

In a world that moves at a relentless pace, a personal diary provides a haven where we can slow down, delve into our innermost thoughts, and make sense of the whirlwind of our daily lives. It becomes a sanctuary for introspection, a place where we can untangle our emotions, explore our dreams, and unravel the complexities of our hearts and minds.`;
const aboutContent = `Welcome to SoulScript - Your Personal Journaling Companion

Unlock the power of self-expression and embark on a transformative journey with SoulScript, a cutting-edge personal journaling application designed to nurture your inner world. Dive into the depths of your thoughts, emotions, and experiences, and discover the true essence of who you are.

Capture the Unforgettable:
SoulScript provides a digital sanctuary for your thoughts and memories. With its intuitive interface, you can effortlessly record your daily musings, profound reflections, and treasured moments. Preserve the precious fragments of your life and watch them weave into a captivating tapestry of your unique story.

Embrace Authenticity:
In the safe haven of SoulScript, embrace your true self without fear or hesitation. Pour your heart onto the virtual pages, expressing your deepest fears, wildest dreams, and untamed emotions. Uncover hidden layers of your identity, embrace vulnerability, and witness your own growth as you navigate the ebb and flow of life.

A Canvas for Creativity:
Ignite your creativity with SoulScript's versatile features. Personalize your journal with beautiful themes, fonts, and colors that resonate with your unique style. Explore the power of multimedia expression by attaching photos, videos, and audio recordings to your entries, capturing the sights, sounds, and emotions that breathe life into your memories.

Unleash Self-Reflection:
SoulScript is more than just a repository of your thoughts; it's a transformative tool for self-reflection. Engage with thought-provoking prompts and exercises carefully crafted to ignite introspection, expand your perspectives, and inspire personal growth. Dive deep into the labyrinth of your mind and unravel the complexities that shape your journey.

Find Clarity in Chaos:
Navigate the ebbs and flows of your life with ease. SoulScript's advanced organization and tagging features allow you to categorize, search, and revisit your entries effortlessly. Find solace in the chaos, extract lessons from the challenges, and celebrate the triumphs that make you who you are.

Secure, Private, and Synced:
At SoulScript, your privacy is our utmost priority. Rest assured knowing that your journal entries are encrypted and secured with state-of-the-art technology. Safeguard your innermost thoughts with passcodes or biometric authentication. Sync your journal seamlessly across multiple devices, allowing you to access your sanctuary anytime, anywhere.

Community and Inspiration:
Connect with a thriving community of like-minded individuals who share the passion for self-discovery and personal growth. Engage in discussions, exchange ideas, and find inspiration from the collective wisdom of fellow journalers. Together, we create a supportive space for authentic expression and meaningful connections.

Start your transformative journaling journey with SoulScript today and unlock the hidden depths of your soul. Let your innermost thoughts soar, your creativity flourish, and your true self shine through the art of journaling. Begin your story with SoulScript - where self-discovery knows no bounds.
`;
const contactContent = `Contact Us: Connect with the Daily Journal Team 

We would love to hear from you and address any questions, feedback, or inquiries you may have. Feel free to reach out to us using the contact information provided below. Our dedicated team is here to assist you and ensure that your experience with Daily Journal is exceptional.

General Inquiries:
For general questions or inquiries about Daily Journal, please email us at info@dailyjournal.com. We strive to respond to all inquiries within 24-48 hours.

Technical Support:
If you are experiencing technical issues or require assistance with the Daily Journal platform, our support team is ready to help. Please email us at support@dailyjournal.com, and we will get back to you promptly to assist you with any technical difficulties.

Partnerships and Collaborations:
If you are interested in partnering with SoulScript or exploring collaboration opportunities, we would love to hear from you. Please reach out to our partnership team at partnerships@dailyjournal.com, and we will be delighted to discuss potential collaborations.

Media and Press Inquiries:
For media-related inquiries, interviews, or press coverage, please contact our media team at media@dailyjournal.com. We are available to provide information, answer questions, and support media outlets interested in featuring Daily Journal.

Feedback and Suggestions:
Your feedback is valuable to us, as it helps us improve and tailor our platform to meet your needs. If you have any suggestions, ideas, or feedback you would like to share, please email us at feedback@dailyjournal.com. We appreciate your input and take it into consideration as we continue to enhance the Daily Journal experience.

Social Media:
Stay connected with Daily Journal by following us on social media. Join our vibrant community on Facebook, Instagram, and Twitter for inspiring content, updates, and conversations.

We look forward to hearing from you and being a part of your journaling journey. Your engagement and support mean the world to us. Thank you for choosing Daily Journal as your personal journaling companion.`;

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

let posts = [];

mongoose.connect(process.env.MONGO_URI);

const BlogSchema = new mongoose.Schema({
  title: String,
  post: String,
  _id : String
});

const BlogModel = mongoose.model('blog', BlogSchema);


app.get('/',async(req,res)=>{
  let blogs = await BlogModel.find()
  res.render("home",{
    HomeStartingContent:homeStartingContent,
    Posts:blogs,
  })

})


app.get('/about',(req,res)=>{
  res.render("about",{AboutContent:aboutContent})
})


app.get('/contact',(req,res)=>{
  res.render("contact",{ContactContent:contactContent})
})


app.get('/compose',(req,res)=>{
  res.render("compose")
})


app.post('/compose',async(req,res)=>{

   
  const post ={
    title: _.kebabCase(req.body.title),
    post: req.body.post
  }

  BlogModel.insertMany(post)

  res.redirect('/')

})


app.get('/posts/:_id',async(req,res)=>{

  let blogs = await BlogModel.find()
   let PostID = req.params._id
    PostID =  _.lowerCase([string=PostID])

  blogs.forEach(function (item){
    let SavedID = _.lowerCase([string=item._id])
        if(SavedID === PostID){
      res.render("post",{
        title: item.title,
        post:item.post

      })
    }
  })
  
})


app.listen(3000, function() {
  console.log("Server started on port 3000");
});
