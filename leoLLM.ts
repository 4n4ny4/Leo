import { Gradient } from "@gradientai/nodejs-sdk";
import dotenv from 'dotenv'; 

function generateWorkoutQuery(
    healthIssues: string,
    jointPain: string,
    height: number,
    weight: number,
    targetMuscles: string[],
    fitnessLevel: string,
    timeAvailability: number,
    equipmentAvailability: string,
    workoutPreferences: string[],
    intensityLevel: string,
    preferredEnvironment: string,
    dietaryRestrictions: string[],
    previousInjuries: string,
    restDays: number,
    goalOrientation: string,
    age: number
): string {
    const query = `Generate a personalized 3 day push-pull-leg workout plan based on the following user preferences: 
    Health issues: ${healthIssues}. 
    Joint pain: ${jointPain}. 
    Height: ${height} cm. 
    Weight: ${weight} kg. 
    Target muscles: ${targetMuscles.join(', ')}. 
    Fitness level: ${fitnessLevel}. 
    Time availability: ${timeAvailability} minutes. 
    Equipment availability: ${equipmentAvailability}. 
    Workout preferences: ${workoutPreferences.join(', ')}. 
    Intensity level: ${intensityLevel}. 
    Preferred environment: ${preferredEnvironment}. 
    Dietary restrictions: ${dietaryRestrictions.join(', ')}. 
    Previous injuries: ${previousInjuries}. 
    Rest days: ${restDays}. 
    Goal orientation: ${goalOrientation}. 
    Age: ${age}.`;
    return query;
}

//load env variables
dotenv.config();

//initialize gradient
const gradient = new Gradient({});



//sample inputs
const healthIssues: string = "None";
const jointPain: string = "Knee pain";
const height: number = 170;
const weight: number = 70;
const targetMuscles: string[] = ["Arms", "Chest", "Back"];
const fitnessLevel: string = "Beginner";
const timeAvailability: number = 45;
const equipmentAvailability: string = "Everything";
const workoutPreferences: string[] = ["Strength training", "Cardio"];
const intensityLevel: string = "Moderate";
const preferredEnvironment: string = "Indoor";
const dietaryRestrictions: string[] = ["Vegetarian"];
const previousInjuries: string = "Sprained ankle";
const restDays: number = 2;
const goalOrientation: string = "Weight loss";
const age: number = 30;


const query: string = generateWorkoutQuery(
    healthIssues,  jointPain, height,  weight, targetMuscles,fitnessLevel, timeAvailability,equipmentAvailability,workoutPreferences,intensityLevel,preferredEnvironment,dietaryRestrictions,previousInjuries,restDays,goalOrientation,age
);

const role_play_prompt: string = `Your name is Coach Leo,a nice, but strict weightlifting coach who wants to help his clients reach their maximum potential and weightlifting goals. You're an expert fitness assistant dedicated to helping individuals achieve their fitness goals safely and effectively. Your responses must prioritize providing detailed and elaborate workout suggestions while adhering strictly to ethical guidelines. Avoid promoting any harmful, unsafe, or ineffective practices. Additionally, ensure that your responses are tailored to the user's specific fitness goals, preferences, and limitations.
Tailor your workout suggestions to address the user's specific fitness objectives, such as building muscle, losing weight, improving endurance, or enhancing flexibility.
Provide detailed and descriptive exercise recommendations, including proper form, technique, and progression strategies.
Emphasize the importance of safety and injury prevention in all workout routines. Encourage users to listen to their bodies and avoid overexertion.
Avoid endorsing any extreme or fad diets, supplements, or exercise methods that could pose risks to the user's health.
Promote a balanced approach to fitness, incorporating elements of strength training, cardiovascular exercise, flexibility training, and recovery.`;

const simple_prompt: string = `<s>### Instruction:\n Your name is Coach Leo,a nice, but strict weightlifting coach who wants to help his clients reach their maximum potential and weightlifting goals. \n\n###Input:\n${query}\n\n### Response:\n`;

const templated_query: string = `<s>### Instruction:\n${role_play_prompt}\n\n###Input:\n${query}\n\n### Response:\n`;
let myAdapter: any;


async function llm(query) {

    let models: any

    try {
         models = await gradient.listModels({ onlyBase: false });
    }
    catch (error) {
        console.log(error)
    }
    


        // List models and find the desired one
    for (const model of models) {
        if ((model as any).name !== undefined) { // Assuming Model has a `name` property
            console.log(`${(model as any).name}: ${(model as any).id}`);
            if ((model as any).name === "LeoBot") {
                myAdapter = model;
            }
        }
    }

    if (myAdapter) {
        // Complete the query
        myAdapter.complete({ query: query, maxGeneratedTokenCount: 500 })
            .then((response) => {
                console.log(`> ${query}\n> ${response.generatedOutput}\n\n`);
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    } else {
        console.error("Desired model 'LeoBot' not found.");
    }

}

llm(templated_query)













