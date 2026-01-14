```markdown
# System Architecture

## C2 Container Diagram (Layered Style)

```mermaid
graph TD
    User[User/Client] -->|HTTP Request| API[Presentation Layer\n(Routes/Controllers)]
    API -->|Call Service| Business[Business Layer\n(Services/Validators)]
    Business -->|Call Repository| Data[Data Access Layer\n(Repositories)]
    Data -->|SQL Query| DB[(SQLite Database)]