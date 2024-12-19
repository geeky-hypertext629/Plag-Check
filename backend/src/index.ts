import express from 'express'
import cors from 'cors'
import http from 'http'
import cookieParser from "cookie-parser";
import { v4 as uuidv4 } from 'uuid';

import PlagirismController from './controller/plagiarism.controller';
import MatchController from './controller/match.controller';
import AiDetectController from './controller/aidetect.controller';
import Middleware from './middleware/extractContent';


const app = express()

app.use(cors({
    origin: '*'
}))

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser());

const server = http.createServer(app)


// app.use((req, res, next) => {
//     let token = req.cookies.userToken;

//     if (!token) {
//         token = uuidv4(); 
//         res.cookie('userToken', token, { httpOnly: true, secure: true, expires: new Date(Date.now() +  60 * 60 * 1000) });
//     }

//     console.log('User Token:', token);
//     next();
// });

app.route('/plag-detect').post(Middleware.extractContent,PlagirismController.submitContent).get();
app.route('/ai-content').post(Middleware.extractContent,AiDetectController.submitContent).get();
app.route('/match-content').post(Middleware.extractContent,MatchController.submitContent).get();

app.get('/', (req, res) => {
    return res.status(200).json({ message: 'This is plag check server' });
});


// const COPYLEAKS_LOGIN_URL = 'https://id.copyleaks.com/v3/account/login/api';
// // https://id.copyleaks.com/v3/account/login/api
// const COPYLEAKS_SUBMIT_URL = 'https://api.copyleaks.com/v3/scans/submit/file';
// // https://api.copyleaks.com/v3/scans/submit/file/studen122wd?
// const COPYLEAKS_RESULT_URL = 'https://api.copyleaks.com/v3/downloads';
// const WEBHOOK_URL='https://kaushandutta.me'

// // Login to Copyleaks and get an access token
// async function getAuthToken() {
//   try {
//     const response = await axios.post(COPYLEAKS_LOGIN_URL, {
//       email: '',
//       key: '',
//     });
//     return response.data.access_token;
//   } catch (error) {
//     console.error('Error getting token:', error.response?.data || error.message);
//     throw error;
//   }
// }

// // Submit a file for scanning
// async function submitFile(authToken, fileBase64, filename) {
//   try {
//     const response = await axios.put(
//       COPYLEAKS_SUBMIT_URL+"/student127",
//       {
//         base64: fileBase64,
//         filename: filename,
//         properties: {
//           webhooks: {
//             status: `${WEBHOOK_URL}/status`,
//           },
//         //   customId: `scan-${Date.now()}`,
//         },
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${authToken}`,
//         },
//       }
//     );
//     console.log(response);
//     return response.data;
//   } catch (error) {

    
//     console.error('Error submitting file:',  error);
//     throw error;
//   }
// }

// // Get results after scan completion
// async function getResults(authToken, scanId) {
//   try {
//     const response = await axios.get(`${COPYLEAKS_RESULT_URL}/${scanId}`, {
//       headers: {
//         Authorization: `Bearer ${authToken}`,
//       },
//     });
//     return response.data;
//   } catch (error) {
//     console.error('Error getting results:', error.response?.data || error.message);
//     throw error;
//   }
// }

// // Endpoint to submit a file
// app.post('/submit', async (req, res) => {
//   const { fileBase64, filename } = req.body;

//   try {
//     const authToken = await getAuthToken();
//     console.log("The auth token",authToken);
//     const submitResponse = await submitFile(authToken, fileBase64, filename);

//     res.json({
//       message: 'File submitted successfully!',
//       scanId: submitResponse.scannedDocument.id,
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: 'Error during file submission',
//       error: error.response?.data || error.message,
//     });
//   }
// });

// // Endpoint to fetch results
// app.get('/results/:scanId', async (req, res) => {
//   const { scanId } = req.params;

//   try {
//     const authToken = await getAuthToken();
//     const results = await getResults(authToken, scanId);

//     res.json({
//       message: 'Results fetched successfully!',
//       results,
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: 'Error fetching results',
//       error: error.response?.data || error.message,
//     });
//   }
// });

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


export default app