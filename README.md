# Task Tracker (Node.js)

A simple command-line Task Tracker built with **Node.js**, following the requirements from the Roadmap.sh project:

Project URL: [https://roadmap.sh/projects/task-tracker](https://roadmap.sh/projects/task-tracker)

---

## 🚀 Getting Started

### **Clone the repository**

```bash
git clone https://github.com/Aimee201291/task-tracker-with-node
cd task-tracker-with-node
```

---

## 📌 Commands

### **Add a task**

```bash
npm run task-tracker add "Buy groceries"
```

### **List all tasks**

```bash
npm run task-tracker list
```

### **List tasks by status**

#### To list tasks with status `todo`:

```bash
npm run task-tracker list todo
```

#### To list tasks with status `in-progress`:

```bash
npm run task-tracker list in-progress
```

#### To list tasks with status `done`:

```bash
npm run task-tracker list done
```

---

## ✏️ Update a task

Update the content of a task by providing its ID:

```bash
npm run task-tracker update 1 "Have breakfast"
```

---

## 🗑️ Delete a task

Remove a task by its ID:

```bash
npm run task-tracker delete 1
```

---

## 🔄 Change task status

### Mark a task as `in-progress`:

```bash
npm run task-tracker mark-in-progress 1
```

### Mark a task as `done`:

```bash
npm run task-tracker mark-done 1
```

---

## 📂 Project Structure

```
/task-tracker-with-node
├── src
│ ├── cli
│ │ └── commandHandler.js
│ ├── core
│ │ └── taskManager.js
│ ├── data
│ │ └── fileStore.json
│ └── index.js
├── package.json
└── README.md
```

---

## 📄 License

This project is open-source and available under the MIT License.
