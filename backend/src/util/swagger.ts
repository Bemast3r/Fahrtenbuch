import { Express, Request, Response } from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "SKM Fahrtenbuch API Documentation",
      version: "1.0.1",
      description: `**Description of the Application**

The application is a comprehensive management system tailored for handling trips, primarily designed for administrative purposes within an organization. It facilitates the tracking, creation, modification, and deletion of trip-related data. The application is secured and requires authentication for access, ensuring the integrity and confidentiality of the data.

**Key Features:**

**Trip Management:** The core functionality of the application revolves around trip management. It enables users, particularly administrators, to perform various actions related to trips, such as retrieving ongoing and completed trips, creating new trips, updating existing trips, and deleting trips from the system.

**Authentication and Authorization:** To ensure secure access to the system, the application implements authentication mechanisms. Users are required to provide valid authentication credentials, typically in the form of a JSON Web Token (JWT), to access protected routes. Additionally, role-based access control (RBAC) is enforced to restrict certain functionalities to authorized users only. For example, administrative privileges are necessary for accessing routes related to trip deletion and modification.

**Error Handling:** The application includes robust error handling mechanisms to gracefully manage unexpected situations and provide informative feedback to users. It distinguishes between different types of errors, such as malformed requests, unauthorized access attempts, and internal server errors, and responds with appropriate HTTP status codes and error messages to aid in troubleshooting and resolution.

**Data Validation:** Data integrity is a top priority, and the application incorporates validation checks at various stages to ensure that incoming data meets specified criteria. Request parameters and payloads undergo validation to verify their correctness and prevent erroneous or malicious data from entering the system. Validation errors are promptly communicated to the user, enabling them to rectify issues and resubmit requests if necessary.

**RESTful API Design:** The application follows the principles of Representational State Transfer (REST) architecture to design its API endpoints. Each endpoint is carefully structured to adhere to REST conventions, including resource naming, HTTP methods, and response formats. This design approach promotes interoperability, scalability, and maintainability of the application, facilitating integration with other systems and future enhancements.

**Target Audience:**

The application caters primarily to organizational entities, such as companies, institutions, or agencies, that manage fleets of vehicles or conduct frequent transportation activities. It is particularly beneficial for administrators and supervisors responsible for overseeing and optimizing trip-related operations within their respective domains.

**Benefits:**

**Efficiency:** By centralizing trip management tasks within a unified platform, the application streamlines administrative workflows and reduces manual intervention. This efficiency gain translates into time savings and improved productivity for users involved in trip planning, monitoring, and reporting activities.

**Accuracy:** The application's validation and error handling mechanisms help maintain data accuracy and consistency throughout the trip lifecycle. By enforcing data validation rules and promptly addressing errors, the system minimizes the risk of data corruption, duplication, or loss, thus enhancing the reliability and trustworthiness of trip-related information.

**Transparency:** Through its comprehensive reporting capabilities and real-time data access, the application fosters transparency and accountability within the organization. Administrators can monitor trip status, track performance metrics, and generate insightful reports to support decision-making processes and ensure compliance with regulatory requirements.

**Security:** With robust authentication, authorization, and data protection measures in place, the application safeguards sensitive information and mitigates security risks associated with unauthorized access, data breaches, or malicious attacks. Users can trust that their trip data remains confidential, secure, and accessible only to authorized personnel.

In summary, the application represents a sophisticated solution for managing trips effectively, securely, and transparently within organizational settings. Its rich feature set, coupled with its emphasis on security, reliability, and user experience, positions it as a valuable tool for optimizing trip-related operations and driving organizational success.

**Useful Links:**
- [Backend](https://fahrtenbuch-backend.vercel.app/)
- [Frontend](https://fahrtenbuch.vercel.app/)`
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/docs/routes.ts"],
};

const swaggerSpec = swaggerJsdoc(options);

function swaggerDocs(app: Express, port: number) {
  // Swagger page
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Docs in JSON format
  app.get("/docs.json", (req: Request, res: Response) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });

  console.info(`Docs available at http://localhost:${port}/docs`);
}
export default swaggerDocs;
