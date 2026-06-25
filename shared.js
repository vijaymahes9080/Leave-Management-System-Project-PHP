// Shared DB Initialization and Session Management for LMS

// Seed Data
const DEFAULT_EMPLOYEES = [
    {
        empId: "EMP101",
        uname: "vijay",
        pass: "26-04-2005",
        name: "Vijay Mahes",
        dept: "IT",
        sick: 10,
        earn: 12,
        casual: 8,
        propic: "default-image.png"
    },
    {
        empId: "EMP102",
        uname: "employee",
        pass: "123",
        name: "Test Employee",
        dept: "HR",
        sick: 8,
        earn: 10,
        casual: 5,
        propic: "default-image.png"
    }
];

const DEFAULT_ADMINS = [
    {
        uname: "admin",
        pass: "admin",
        dept: "IT",
        sickMax: 15,
        earnMax: 20,
        casualMax: 10
    }
];

const DEFAULT_LEAVES = [
    {
        id: 1,
        empId: "EMP101",
        empName: "Vijay Mahes",
        type: "Casual Leave",
        startDate: "2026-07-01",
        endDate: "2026-07-03",
        days: 3,
        status: "Pending",
        reason: "",
        requestDate: "2026-06-25",
        dept: "IT"
    }
];

// DB Init
function initDatabase() {
    const existing = localStorage.getItem("lms_employees");
    if (existing && existing.includes("25-06-1995")) {
        localStorage.removeItem("lms_employees");
        localStorage.removeItem("lms_leaves");
    }

    if (!localStorage.getItem("lms_employees")) {
        localStorage.setItem("lms_employees", JSON.stringify(DEFAULT_EMPLOYEES));
    }
    if (!localStorage.getItem("lms_admins")) {
        localStorage.setItem("lms_admins", JSON.stringify(DEFAULT_ADMINS));
    }
    if (!localStorage.getItem("lms_leaves")) {
        localStorage.setItem("lms_leaves", JSON.stringify(DEFAULT_LEAVES));
    }
}

// Session Management
function getCurrentSession() {
    const session = localStorage.getItem("lms_session");
    return session ? JSON.parse(session) : null;
}

function setCurrentSession(user, role) {
    localStorage.setItem("lms_session", JSON.stringify({ user, role }));
}

function logout(relativeRoot = "") {
    localStorage.removeItem("lms_session");
    window.location.href = relativeRoot + "index.html";
}

// Data Handlers
function getEmployees() {
    return JSON.parse(localStorage.getItem("lms_employees") || "[]");
}

function saveEmployees(employees) {
    localStorage.setItem("lms_employees", JSON.stringify(employees));
}

function getAdmins() {
    return JSON.parse(localStorage.getItem("lms_admins") || "[]");
}

function saveAdmins(admins) {
    localStorage.setItem("lms_admins", JSON.stringify(admins));
}

function getLeaves() {
    return JSON.parse(localStorage.getItem("lms_leaves") || "[]");
}

function saveLeaves(leaves) {
    localStorage.setItem("lms_leaves", JSON.stringify(leaves));
}

// Dynamic Navigation Loader
function injectNavbar(relativeRoot = "") {
    const session = getCurrentSession();
    let navbarHTML = `
    <style>
    ul.navi-list {
        list-style-type: none;
        margin: 0;
        padding: 0;
        overflow: hidden;
        background-color: #f0f0f0;
        font-family: "Segoe UI Light","Segoe WPC","Segoe UI", Helvetica, Arial, Sans-Serif;
        font-size: 17px;
        font-weight: 500;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }
    ul.navi-list li {
        float: left;
    }
    ul.navi-list li a, .navi-dropbtn {
        display: inline-block;
        color: #272626;
        text-align: center;
        padding: 14px 16px;
        text-decoration: none;
        transition: background-color 0.3s;
        cursor: pointer;
    }
    ul.navi-list li a:hover, .navi-dropdown:hover .navi-dropbtn {
        background-color: #949494;
        color: white;
    }
    ul.navi-list li.navi-dropdown {
        display: inline-block;
        position: relative;
    }
    .navi-dropdown-content {
        display: none;
        position: absolute;
        background-color: #f0f0f0;
        min-width: 160px;
        box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
        z-index: 1000;
    }
    .navi-dropdown-content a {
        color: #272626;
        padding: 12px 16px;
        text-decoration: none;
        display: block;
        text-align: left;
    }
    .navi-dropdown-content a:hover {
        background-color: #949494;
        color: white;
    }
    .navi-dropdown:hover .navi-dropdown-content {
        display: block;
    }
    </style>
    <ul class="navi-list">
    `;

    if (!session) {
        navbarHTML += `
            <li><a href="${relativeRoot}index.html">Home</a></li>
            <li class="navi-dropdown">
                <a class="navi-dropbtn">Login</a>
                <div class="navi-dropdown-content">
                    <a href="${relativeRoot}admin/index.html">Admin</a>
                    <a href="${relativeRoot}client/index.html">Client</a>
                </div>
            </li>
            <li><a href="${relativeRoot}about.html">About</a></li>
        `;
    } else if (session.role === "client") {
        navbarHTML += `
            <li><a href="${relativeRoot}client/home.html">Home</a></li>
            <li><a href="${relativeRoot}client/leaverequest.html">Request Leave</a></li>
            <li><a href="${relativeRoot}client/my_leaves.html">My Leaves</a></li>
            <li><a onclick="logout('${relativeRoot}')">Logout (${session.user.name})</a></li>
        `;
    } else if (session.role === "admin") {
        navbarHTML += `
            <li><a href="${relativeRoot}admin/view_leaves.html">View Leaves</a></li>
            <li><a href="${relativeRoot}admin/searchemp.html">Search Employee</a></li>
            <li><a href="${relativeRoot}admin/set_leaves.html">Set Leaves</a></li>
            <li><a onclick="logout('${relativeRoot}')">Logout (Admin)</a></li>
        `;
    }

    navbarHTML += `</ul>`;
    
    const container = document.getElementById("navi-container");
    if (container) {
        container.innerHTML = navbarHTML;
    }
}

// Run database init immediately
initDatabase();
