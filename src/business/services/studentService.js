const studentRepository = require('../../data/repositories/studentRepository');
const studentValidator = require('../validators/studentValidator');

class StudentService {
    async getAllStudents(major = null, status = null) {
        const rows = await studentRepository.findAll(major, status);
        
        const active = rows.filter(s => s.status === 'active').length;
        const graduated = rows.filter(s => s.status === 'graduated').length;
        const suspended = rows.filter(s => s.status === 'suspended').length;
        const avgGPA = rows.length > 0 
            ? (rows.reduce((sum, s) => sum + s.gpa, 0) / rows.length).toFixed(2)
            : 0;

        return {
            students: rows,
            statistics: { 
                active, graduated, suspended, 
                total: rows.length, 
                averageGPA: parseFloat(avgGPA) 
            }
        };
    }

    async getStudentById(id) {
        const student = await studentRepository.findById(id);
        if (!student) throw new Error('Student not found');
        return student;
    }

    async createStudent(studentData) {
        studentValidator.validateStudentData(studentData);
        return await studentRepository.create(studentData);
    }

    async updateStudent(id, studentData) {
        await this.getStudentById(id);
        studentValidator.validateStudentData(studentData);
        return await studentRepository.update(id, studentData);
    }

    async updateGPA(id, gpa) {
        await this.getStudentById(id);
        studentValidator.validateGPA(gpa);
        return await studentRepository.updateGPA(id, gpa);
    }

    async updateStatus(id, status) {
        const student = await this.getStudentById(id);
        studentValidator.validateStatus(status);
        
        if (student.status === 'withdrawn') {
            throw new Error('Cannot change status of withdrawn student');
        }
        
        return await studentRepository.updateStatus(id, status);
    }

    async deleteStudent(id) {
        const student = await this.getStudentById(id);
        
        if (student.status === 'active') {
            throw new Error('Cannot delete active student. Change status first.');
        }
        
        return await studentRepository.delete(id);
    }
}

module.exports = new StudentService();