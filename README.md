<h1>DocNotes</h1>
<p>Professional therapy session management with AI-powered transcription.</p>



<h2>🚀Setup Instructions</h2>
<h3>1. Install Dependencies</h3>
<p>• ```bash <br>
• npm install</p>

<h3>2. Set Up Environment Variables</h3>
<p>• Create a .env.local file in the root directory and add your OpenAI API key:<br>
• OPENAI_API_KEY=your_api_key_here</p>

<h3>3. Run the Development Server</h3>
<p>• npm run dev<br>
• Your app should now be running at http://localhost:3000.</p>



<h2>🛠 Design & Tech Notes</h2>

<h3>Component Library Choice:</h3>
<p>• Using <strong>shadcn/ui</strong> (built on <strong>Tailwind CSS</strong>) for a consistent, modern, and accessible component system. Combined with <strong>Next.js</strong> as the app framework.</p>

<h3>Rationale for Speed & Consistency:</h3>
<p>• Prebuilt, styled components from shadcn/ui speed up development.<br>• Tailwind CSS provides utility-first styling for rapid iteration.<br>
• Next.js enables server-side rendering (SSR) and API routes, ensuring both performance and flexibility.<br>
• Opinionated stack reduces decision-making overhead, improving consistency across the project.<br>
• Responsiveness is well-considered: Tailwind’s responsive utilities ensure the app adapts seamlessly across mobile, tablet, and desktop devices.<br>
• Accessibility is prioritized: Shadcn/ui ensures keyboard navigation, screen reader support, and adherence to WAI-ARIA guidelines.</p>

<h3>Trade-offs:</h3>
<p>• <strong>Shadcn/ui</strong> requires some setup and manual component importing, which adds a small initial learning curve.<br>
• <strong>Tailwind CSS</strong> can lead to verbose classnames in markup, though it avoids maintaining large CSS files.<br>
• <strong>Next.js</strong> introduces complexity around data fetching (SSR vs CSR vs ISR), which may be overkill for small projects. </p>


<h2>🌐 Deployment</h2>

<h3>Deployed on:</h3>
<p>• The project is deployed on <strong>Vercel</strong>.</p>

<h3>Rationale for Choice:</h3>
<p>• Vercel offers the smoothest deployment experience for Next.js apps since it’s the framework’s native platform. Automatic Git integration, previews for every pull request, and serverless function support make it ideal for rapid iteration and scaling.</p>


<h2>📦 Available Scripts</h2>

<p>• <strong>npm run dev</strong> → Runs the development server<br>
• <strong>npm run build</strong> → Builds the app for production<br>
• <strong>npm start</strong> → Runs the built app in production</p>




