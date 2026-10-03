# Contributing to Pet Connect

Thank you for your interest in contributing to **Pet Connect**! This project welcomes contributions from engineers, designers, veterinarians, and animal welfare advocates.

---

## 1. Code of Conduct
We are committed to providing a friendly, safe, and welcoming environment for everyone, regardless of background or identity. We prioritize kindness toward both people and animals.

---

## 2. Development Workflow

1. **Fork the Repository & Create a Branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Adhere to Code Standards:**
   - **Frontend:** Follow idiomatic React hooks and TypeScript strict mode. Keep components modular in `src/components/`.
   - **Styling:** Use Tailwind utility classes. Do not hardcode arbitrary CSS unless defining reusable design tokens.
   - **Backend:** Maintain clean separation between controllers, services, routes, and models. Always sanitize user input.
   - **Type Safety:** Maintain shared types in `types/index.ts` (frontend) and `models/types.ts` (backend).

3. **Verify Local Quality Before Submitting:**
   - Run frontend build: `npm --prefix frontend run build`
   - Run backend build: `npm --prefix backend run build`
   - Ensure clean console with zero lint or runtime warnings.

---

## 3. Pull Request Guidelines
- Include a descriptive title and clear summary of changes.
- Attach screenshots or recordings demonstrating new UI flows or responsive behavior.
- Link relevant issues or user stories.
