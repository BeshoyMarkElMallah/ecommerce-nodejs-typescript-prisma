import express, { Express, Request, Response } from 'express';
import { PORT } from './secrets';
import rootRouter from './routes';
import { PrismaClient } from '@prisma/client';
import { errorMiddleware } from './middlewares/errors';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const app: Express = express();
const swaggerOptions = {  
    definition: {  
      openapi: '3.0.0', // Specify the version of OpenAPI  
      info: {  
        title: 'My API',  
        version: '1.0.0'  
      },  
    },  
    apis: ['src/routes/*.ts'], // Path to the API docs  
    servers:[
        {
            url: 'http://localhost:3000',
            description: 'Development server'
        }
    ]
  };  

  const swaggerSpec = swaggerJsDoc(swaggerOptions)

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/api', rootRouter);

function swaggerDocs(app:any, port:any) {
    // Swagger Page
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
    // Documentation in JSON format
    app.get('/docs.json', (req:any, res:any) => {
      res.setHeader('Content-Type', 'application/json')
      res.send(swaggerSpec)
    })
  }
  swaggerDocs(app,PORT)




export const prismaClient = new PrismaClient({
    log: ['query'],

}).$extends({
    result:{
        address:{
            formattedAddres:{
                needs:{
                    lineOne:true,
                    lineTwo:true,
                    city:true,
                    country:true,
                    pincode:true
                },
                compute:(addr)=>{
                    return `${addr.lineOne}, ${addr.lineTwo}, ${addr.city}, ${addr.country}-${addr.pincode}`
                }
            }
        }
    }
})

app.use(errorMiddleware);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});