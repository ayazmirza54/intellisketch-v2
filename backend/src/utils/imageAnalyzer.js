const { GoogleGenerativeAI } = require("@google/generative-ai");
const sharp = require('sharp');
const { GEMINI_API_KEY } = require('../config/constants');

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

async function analyzeImage(buffer) {
    try {
        console.log('Received image buffer size:', buffer.length);

        // Convert the input to PNG format with a maximum width of 1000px
        const pngBuffer = await sharp(buffer)
            .png()
            .resize({ width: 1000, withoutEnlargement: true })
            .toBuffer();

        console.log('Processed PNG buffer size:', pngBuffer.length);

        const base64Image = pngBuffer.toString('base64');

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `You have been given an image containing mathematical expressions, equations, or graphical problems. Your task is to analyze the image and respond accordingly.

1. **Mathematical Expressions**: If the image contains simple mathematical expressions (e.g., 2 + 2, 3 * 4), solve them and return the answer in the format:
   - [{"expr": "given expression", "result": calculated answer}]

2. **Equations**: For equations (e.g., x^2 + 2x + 1 = 0), solve for the variables and return a comma-separated list of dictionaries:
   - [{"expr": "variable", "result": value, "assign": true}]

3. **Graphical Problems**: If the image presents a graphical problem (e.g., a graph or chart), describe the problem and provide the result in the format:
   - [{"expr": "short description of the graphical problem", "result": "Result of the graphical problem"}]

4. **Non-Mathematical Images**: If the image does not contain any mathematical expressions or equations, return a description in this format:
   - [{"expr": "short description of the image", "result": "long description of the image"}]

5. **Edge Cases**: If the input is invalid or cannot be processed, return an error message indicating the issue.

6. **PEMDAS Rule**: Use the PEMDAS rule for solving mathematical expressions. Remember to handle parentheses, exponents, multiplication, division, addition, and subtraction in the correct order.

7. **User-Assigned Variables**: Use the provided dictionary of user-assigned variables when applicable: ${JSON.stringify(dictOfVars)}. Ensure all keys and values are properly quoted for easier parsing with JavaScript's JSON.parse.

Please avoid using backticks or markdown formatting in your response.`;

        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    mimeType: "image/png",
                    data: base64Image
                }
            }
        ]);

        const response = result.response;
        const generatedText = response.text();
        console.log(generatedText);

        let answers = [];
        try {
            answers = JSON.parse(generatedText);
        } catch (e) {
            console.error(`Error in parsing response from Gemini API: ${e}`);
        }

        console.log('returned answer ', answers);
        for (const answer of answers) {
            answer.assign = answer.assign || false;
        }

        return answers;
    } catch (error) {
        console.error('Error processing image:', error);
        throw new Error('Image processing failed: ' + error.message);
    }
}

module.exports = { analyzeImage };