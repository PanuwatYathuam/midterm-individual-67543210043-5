# Software Architecture Documentation

## 1. C1 System Context Diagram

ภาพรวมการทำงานของระบบในระดับสูง แสดงการเชื่อมต่อระหว่างผู้ใช้งานและระบบ

![alt text](<C1 Context.png>)

## 2. C2 Container Diagram (Layered Architecture)

โครงสร้างภายในของระบบที่ถูกออกแบบด้วยรูปแบบ Layered Architecture (3-tier) เพื่อแยกส่วนรับผิดชอบ (Separation of Concerns) อย่างชัดเจน

![alt text](<C2 Contrainer Diagram.png>)

## 3. อธิบาย Responsibilities ของแต่ละ Layer

Layer 1: Presentation Layer (src/presentation)
หน้าที่หลัก: จัดการกับ HTTP Request และ Response (หน้าด่าน)

Routes: กำหนด Endpoint URL (เช่น GET /api/students) และเชื่อมโยงไปยัง Controller

Controllers: - รับค่าจาก Request (Body, Query, Params)

เรียกใช้ Service เพื่อทำงานตาม Logic

ส่งค่า HTTP Status Code (200, 400, 500) และ JSON Response กลับไปให้ Client

Middlewares: จัดการ Error handling และการดักจับ Request ก่อนเข้า Controller

Layer 2: Business Logic Layer (src/business)
หน้าที่หลัก: เป็นสมองของระบบ จัดการกฎทางธุรกิจและการตรวจสอบข้อมูล

Services: - รวบรวม Business Logic (เช่น การคำนวณ GPA, กฎการห้ามลบนักเรียน Active)

ประสานงานระหว่าง Controller และ Repository

Validators: - ตรวจสอบความถูกต้องของข้อมูล (Validation) เช่น รูปแบบ Email, รหัสนักศึกษา 10 หลัก

ถ้าข้อมูลผิดจะส่ง Error กลับไปทันที ไม่ต้องถึง Database

Layer 3: Data Access Layer (src/data)
หน้าที่หลัก: จัดการการติดต่อกับฐานข้อมูล (Database)

Repositories: - เก็บคำสั่ง SQL (SELECT, INSERT, UPDATE, DELETE)

แปลงข้อมูลจาก Database (Rows) ให้เป็น Object ที่นำไปใช้ต่อได้

Database: จัดการ Connection และการตั้งค่าตาราง (Schema) ของ SQLite

## 4. อธิบาย Data Flow (Request → Response)

ลำดับการทำงานเมื่อมี Request เข้ามาในระบบ (เช่น การสร้างนักเรียนใหม่):

1.Client ส่ง POST /api/students พร้อม JSON Data

2.Presentation Layer (Router) รับ Request และส่งต่อให้ StudentController

3.StudentController รับข้อมูลจาก Body และเรียกใช้ StudentService.createStudent()

4.Business Layer (Service) เรียก StudentValidator เพื่อตรวจสอบข้อมูล ถ้าข้อมูลผิด: Throw Error กลับทันที ถ้าข้อมูลถูก: เรียกใช้ StudentRepository.create()

5.Data Layer (Repository) รันคำสั่ง INSERT INTO students... ลงใน SQLite

6.SQLite บันทึกข้อมูลและส่งผลลัพธ์ (Row ที่สร้างเสร็จ) กลับมา

7.Repository ส่ง Object นักเรียนกลับไปที่ Service

8.Service ส่งผลลัพธ์กลับไปที่ Controller

9.Controller ส่ง HTTP 201 Created พร้อม JSON กลับไปหา Client