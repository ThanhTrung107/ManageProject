import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { DropdownModule } from 'primeng/dropdown';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { StaffService, Staff } from '../../services/staff.service';
import { AuthService } from '../../services/auth.service';
import { SalaryService, Salary } from '../../services/salary.service';
import { SortEvent } from 'primeng/api';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, FormsModule, TableModule, ButtonModule, DialogModule, InputTextModule, DropdownModule, ConfirmDialogModule, InputIconModule, IconFieldModule],
  providers: [ConfirmationService],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  staffs: Staff[] = [];
  error: string | null = null;
  viewDialogVisible: boolean = false;
  editDialogVisible: boolean = false;
  addDialogVisible: boolean = false;
  selectedStaff: Staff | null = null;
  editingStaff: Staff = {};
  addingStaff: Staff = {};
  salaryDialogVisible: boolean = false;
  staffSalaries: Salary[] = [];
  salaryLoading: boolean = false;
  searchValue: string | undefined;
  // Add salary dialog for new staff
  addSalaryDialogVisible: boolean = false;
  tempSalaries: Salary[] = [];
  newSalary: Salary = {};
  salaryErrors: { [key: string]: string } = {};
  // Edit salary in edit staff form
  editSalaryDialogVisible: boolean = false;
  editSalaries: Salary[] = [];
  editSalaryLoading: boolean = false;
  editingSalary: Salary = {};
  editSalaryErrors: { [key: string]: string } = {};

  // Thêm lương mới cho nhân viên đang edit
  addSalaryForEditDialogVisible: boolean = false;
  newSalaryForEdit: Salary = {};
  addSalaryForEditErrors: { [key: string]: string } = {};

  editErrors: { [key: string]: string } = {};

  addErrors: { [key: string]: string } = {};

  genderOptions = [
    { label: 'Nam', value: '1' },
    { label: 'Nữ', value: '0' }
  ];

  statusOptions = [
    { label: 'Đang hoạt động', value: '1' },
    { label: 'Ngừng hoạt động', value: '0' }
  ];

  positionOptions = [
    { label: 'Nhân viên', value: 1 },
    { label: 'Quản lý', value: 2 },
    { label: 'Giám đốc', value: 3 }
  ]

  constructor(
    private staffService: StaffService,
    private confirmationService: ConfirmationService,
    public authService: AuthService,
    private salaryService: SalaryService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadStaffs();
  }
  get isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  get canDelete(): boolean {
    return this.authService.canDelete();
  }

  get canCreate(): boolean {
    return this.authService.canCreate();
  }

  get currentUsername(): string {
    return this.authService.getUsername() || '';
  }

  get currentRole(): string {
    return this.authService.getRole() || '';
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
  customSort(event: SortEvent) {
    if (!event.data || !event.field) return;

    //Lưu lại giá trị field và order vào biến cục bộ để TypeScript không báo lỗi undefined
    const field = event.field;
    const order = event.order || 1;

    event.data.sort((data1, data2) => {
      //Luôn đưa '1' - Đang hoạt động lên đầu) 
      const status1 = data1.status;
      const status2 = data2.status;

      // Nếu status khác nhau, luôn sắp xếp theo status
      if (status1 !== status2) {
        // Nếu status1 là '1' (Active) thì nó nhỏ hơn (đứng trước) => trả về -1
        return status1! > status2! ? -1 : 1;
      }

      // CỘT NGƯỜI DÙNG CHỌN
      const value1 = (data1 as any)[field];
      const value2 = (data2 as any)[field];

      let result = 0;

      if (value1 == null && value2 != null) result = -1;
      else if (value1 != null && value2 == null) result = 1;
      else if (value1 == null && value2 == null) result = 0;
      else if (typeof value1 === 'string' && typeof value2 === 'string') {
        result = value1.localeCompare(value2);
      } else {
        result = (value1 < value2) ? -1 : (value1 > value2) ? 1 : 0;
      }

      return order * result;
    });
  }
  loadStaffs() {
    this.error = null;

    this.staffService.getStaffs().subscribe({
      next: (data) => {
        this.staffs = data.map(staff => ({
          ...staff,
          genderDisplay: staff.gender === '1' ? 'Nam' : 'Nữ',
          statusDisplay: staff.status === '1' ? 'Đang hoạt động' : 'Ngừng hoạt động'
        }));

      },
      error: (err) => {
        this.error = 'Không thể tải dữ liệu: ' + err.message;


      }
    });
  }

  viewStaff(id: number) {
    this.error = null;

    this.staffService.getStaff(id).subscribe({
      next: (data) => {
        this.selectedStaff = data;
        this.viewDialogVisible = true;
      },
      error: (err) => {
        this.error = 'Không thể tải thông tin nhân viên: ' + err.message;
      }
    });
  }


  editStaff(staff: Staff) {
    this.editingStaff = { ...staff }; // Clone object để tránh edit trực tiếp
    this.editErrors = {};
    this.editSalaries = []; // Reset danh sách lương
    this.editDialogVisible = true;
  }

  validateEditForm(): boolean {
    this.editErrors = {};
    let isValid = true;

    if (!this.editingStaff.fullname || this.editingStaff.fullname.trim() === '') {
      this.editErrors['fullname'] = 'Họ và tên không được để trống';
      isValid = false;
    }

    if (!this.editingStaff.email || this.editingStaff.email.trim() === '') {
      this.editErrors['email'] = 'Email không được để trống';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.editingStaff.email)) {
      this.editErrors['email'] = 'Email không hợp lệ';
      isValid = false;
    }

    if (!this.editingStaff.phone || this.editingStaff.phone.trim() === '') {
      this.editErrors['phone'] = 'Số điện thoại không được để trống';
      isValid = false;
    } else if (!/^0\d{9}$/.test(this.editingStaff.phone)) {
      this.editErrors['phone'] = 'Số điện thoại không hợp lệ (10 chữ số)';
      isValid = false;
    }

    if (!this.editingStaff.gender) {
      this.editErrors['gender'] = 'Giới tính không được để trống';
      isValid = false;
    }

    if (!this.editingStaff.address || this.editingStaff.address.trim() === '') {
      this.editErrors['address'] = 'Địa chỉ không được để trống';
      isValid = false;
    }

    if (!this.editingStaff.status) {
      this.editErrors['status'] = 'Trạng thái không được để trống';
      isValid = false;
    }

    if (!this.editingStaff.citizenId || this.editingStaff.citizenId.trim() === '') {
      this.editErrors['citizenId'] = 'CCCD không được để trống';
      isValid = false;
    } else if (!/^\d{12}$/.test(this.editingStaff.citizenId)) {
      this.editErrors['citizenId'] = 'CCCD không hợp lệ (12 chữ số)';
      isValid = false;
    }

    if (!this.editingStaff.position_id) {
      this.editErrors['position_id'] = 'Chức vụ không được để trống';
      isValid = false;
    }

    if (!this.editingStaff.birthday) {
      this.editErrors['birthday'] = 'Ngày sinh không được để trống';
      isValid = false;
    } else if (new Date(this.editingStaff.birthday) > new Date()) {
      this.editErrors['birthday'] = 'Ngày sinh không được lớn hơn ngày hiện tại';
      isValid = false;
    }

    if (!this.editingStaff.department_id) {
      this.editErrors['department_id'] = 'Phòng ban không được để trống';
      isValid = false;
    }

    if (!this.editingStaff.join_date) {
      this.editErrors['join_date'] = 'Ngày bắt đầu làm việc không được để trống';
      isValid = false;
    } else if (new Date(this.editingStaff.join_date) > new Date()) {
      this.editErrors['join_date'] = 'Ngày bắt đầu làm việc không được lớn hơn ngày hiện tại';
      isValid = false;
    }

    return isValid;
  }

  saveStaff() {
    if (!this.editingStaff.id) return;

    if (!this.validateEditForm()) {
      return;
    }

    this.staffService.updateStaff(this.editingStaff.id, this.editingStaff).subscribe({
      next: (data) => {
        this.editDialogVisible = false;
        this.loadStaffs();
      },
      error: (err) => {
        this.error = 'Không thể cập nhật nhân viên: ' + err.message;
      }
    });
  }

  openAddDialog() {
    this.addingStaff = {};
    this.addErrors = {}; // Reset validation errors
    this.tempSalaries = []; // Reset temp salaries
    this.addDialogVisible = true;
  }

  validateAddForm(): boolean {
    this.addErrors = {};
    let isValid = true;

    if (!this.addingStaff.fullname || this.addingStaff.fullname.trim() === '') {
      this.addErrors['fullname'] = 'Họ và tên không được để trống';
      isValid = false;
    }

    if (!this.addingStaff.email || this.addingStaff.email.trim() === '') {
      this.addErrors['email'] = 'Email không được để trống';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.addingStaff.email)) {
      this.addErrors['email'] = 'Email không hợp lệ';
      isValid = false;
    }

    if (!this.addingStaff.phone || this.addingStaff.phone.trim() === '') {
      this.addErrors['phone'] = 'Số điện thoại không được để trống';
      isValid = false;
    } else if (!/^\d{10,15}$/.test(this.addingStaff.phone)) {
      this.addErrors['phone'] = 'Số điện thoại không hợp lệ (10-15 chữ số)';
      isValid = false;
    }

    if (!this.addingStaff.gender) {
      this.addErrors['gender'] = 'Giới tính không được để trống';
      isValid = false;
    }

    if (!this.addingStaff.address || this.addingStaff.address.trim() === '') {
      this.addErrors['address'] = 'Địa chỉ không được để trống';
      isValid = false;
    }

    if (!this.addingStaff.status) {
      this.addErrors['status'] = 'Trạng thái không được để trống';
      isValid = false;
    }

    if (!this.addingStaff.citizenId || this.addingStaff.citizenId.trim() === '') {
      this.addErrors['citizenId'] = 'CCCD không được để trống';
      isValid = false;
    } else if (!/^\d{9,12}$/.test(this.addingStaff.citizenId)) {
      this.addErrors['citizenId'] = 'CCCD không hợp lệ (9-12 chữ số)';
      isValid = false;
    }

    if (!this.addingStaff.position_id) {
      this.addErrors['position_id'] = 'Chức vụ không được để trống';
      isValid = false;
    }

    if (!this.addingStaff.birthday) {
      this.addErrors['birthday'] = 'Ngày sinh không được để trống';
      isValid = false;
    } else if (new Date(this.addingStaff.birthday) > new Date()) {
      this.addErrors['birthday'] = 'Ngày sinh không được lớn hơn ngày hiện tại';
      isValid = false;
    }

    if (!this.addingStaff.department_id) {
      this.addErrors['department_id'] = 'Phòng ban không được để trống';
      isValid = false;
    }

    if (!this.addingStaff.join_date) {
      this.addErrors['join_date'] = 'Ngày bắt đầu làm việc không được để trống';
      isValid = false;
    } else if (new Date(this.addingStaff.join_date) > new Date()) {
      this.addErrors['join_date'] = 'Ngày bắt đầu làm việc không được lớn hơn ngày hiện tại';
      isValid = false;
    }

    return isValid;
  }

  createStaff() {
    if (!this.validateAddForm()) {
      return;
    }

    const staffData = {
      ...this.addingStaff,
      salaries: this.tempSalaries.length > 0 ? this.tempSalaries : []
    };

    this.staffService.createStaff(staffData).subscribe({
      next: (data) => {
        this.addDialogVisible = false;
        this.tempSalaries = [];
        this.loadStaffs();
      },
      error: (err) => {
        if (err.status === 400 && err.error) {
          this.addErrors = err.error;
        } else {
          this.error = 'Lỗi hệ thống: ' + err.message;
        }
      }
    });
  }

  clearEditError(fieldName: string) {
    delete this.editErrors[fieldName];
  }

  clearAddError(fieldName: string) {
    delete this.addErrors[fieldName];
  }

  onDepartmentIdChange(isEditForm: boolean) {
    if (isEditForm) {
      if (this.editingStaff.department_id) {
        this.editingStaff.department_id = this.editingStaff.department_id.toUpperCase();
      }
      this.clearEditError('department_id');
    } else {
      if (this.addingStaff.department_id) {
        this.addingStaff.department_id = this.addingStaff.department_id.toUpperCase();
      }
      this.clearAddError('department_id');
    }
  }

  deleteStaff(id: number) {
    this.confirmationService.confirm({
      message: `Bạn có chắc chắn muốn xóa nhân viên này không?`,
      header: 'Xác nhận xóa',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Xóa',
      rejectLabel: 'Hủy',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        if (!id) return;

        this.error = null;
        this.staffService.deleteStaff(id).subscribe({
          next: () => {
            this.loadStaffs();
          },
          error: (err) => {
            this.error = 'Không thể xóa nhân viên: ' + err.message;
          }
        });
      }
    });
  }

  openAddSalaryDialog() {
    this.newSalary = {};
    this.salaryErrors = {};
    this.addSalaryDialogVisible = true;
  }

  validateSalaryForm(): boolean {
    this.salaryErrors = {};
    let isValid = true;

    if (!this.newSalary.month) {
      this.salaryErrors['month'] = 'Tháng không được để trống';
      isValid = false;
    } else if (this.newSalary.month < 1 || this.newSalary.month > 12) {
      this.salaryErrors['month'] = 'Tháng phải từ 1 đến 12';
      isValid = false;
    } else if (this.tempSalaries.some(s => s.month === this.newSalary.month)) {
      this.salaryErrors['month'] = 'Tháng này đã có bảng lương';
      isValid = false;
    }

    if (!this.newSalary.basicSalary || this.newSalary.basicSalary <= 0) {
      this.salaryErrors['basicSalary'] = 'Lương cơ bản phải lớn hơn 0';
      isValid = false;
    }

    if (this.newSalary.bonus !== undefined && this.newSalary.bonus < 0) {
      this.salaryErrors['bonus'] = 'Thưởng không được âm';
      isValid = false;
    }

    return isValid;
  }

  addTempSalary() {
    if (!this.validateSalaryForm()) {
      return;
    }

    this.tempSalaries.push({ ...this.newSalary });
    this.addSalaryDialogVisible = false;
    this.newSalary = {};
  }

  removeTempSalary(index: number) {
    this.tempSalaries.splice(index, 1);
  }

  clearSalaryError(fieldName: string) {
    delete this.salaryErrors[fieldName];
  }



  loadEditSalaries() {
    if (!this.editingStaff?.id) return;

    this.editSalaryLoading = true;
    this.salaryService.getStaffSalary(this.editingStaff.id).subscribe({
      next: (data) => {
        this.editSalaries = Array.isArray(data) ? data : [data];
        this.editSalaryLoading = false;
      },
      error: (err) => {
        this.error = 'Không thể tải thông tin lương: ' + err.message;
        this.editSalaryLoading = false;
      }
    });
  }

  openEditSalaryDialog(salary: Salary) {
    this.editingSalary = { ...salary };
    this.editSalaryErrors = {};
    this.editSalaryDialogVisible = true;
  }

  validateEditSalaryForm(): boolean {
    this.editSalaryErrors = {};
    let isValid = true;

    if (!this.editingSalary.month) {
      this.editSalaryErrors['month'] = 'Tháng không được để trống';
      isValid = false;
    } else if (this.editingSalary.month < 1 || this.editingSalary.month > 12) {
      this.editSalaryErrors['month'] = 'Tháng phải từ 1 đến 12';
      isValid = false;
    }

    if (!this.editingSalary.basicSalary || this.editingSalary.basicSalary <= 0) {
      this.editSalaryErrors['basicSalary'] = 'Lương cơ bản phải lớn hơn 0';
      isValid = false;
    }

    if (this.editingSalary.bonus !== undefined && this.editingSalary.bonus < 0) {
      this.editSalaryErrors['bonus'] = 'Thưởng không được âm';
      isValid = false;
    }

    return isValid;
  }

  saveEditSalary() {
    if (!this.validateEditSalaryForm()) {
      return;
    }

    if (!this.editingSalary.id) {
      this.error = 'Không tìm thấy ID bảng lương';
      return;
    }

    this.salaryService.updateStaffSalary(this.editingSalary.id, this.editingSalary).subscribe({
      next: () => {
        this.editSalaryDialogVisible = false;
        this.loadEditSalaries(); // Reload danh sách lương
      },
      error: (err) => {
        if (err.status === 400 && err.error) {
          this.editSalaryErrors = err.error;
        } else {
          this.editSalaryErrors['general'] = 'Lỗi hệ thống: ' + err.message;
        }
      }
    });
  }

  clearEditSalaryError(fieldName: string) {
    delete this.editSalaryErrors[fieldName];
  }



  openAddSalaryForEditDialog() {
    this.newSalaryForEdit = {};
    this.addSalaryForEditErrors = {};
    this.addSalaryForEditDialogVisible = true;
  }

  validateAddSalaryForEditForm(): boolean {
    this.addSalaryForEditErrors = {};
    let isValid = true;

    if (!this.newSalaryForEdit.month) {
      this.addSalaryForEditErrors['month'] = 'Tháng không được để trống';
      isValid = false;
    } else if (this.newSalaryForEdit.month < 1 || this.newSalaryForEdit.month > 12) {
      this.addSalaryForEditErrors['month'] = 'Tháng phải từ 1 đến 12';
      isValid = false;
    }



    if (!this.newSalaryForEdit.basicSalary || this.newSalaryForEdit.basicSalary <= 0) {
      this.addSalaryForEditErrors['basicSalary'] = 'Lương cơ bản phải lớn hơn 0';
      isValid = false;
    }

    if (this.newSalaryForEdit.bonus !== undefined && this.newSalaryForEdit.bonus < 0) {
      this.addSalaryForEditErrors['bonus'] = 'Thưởng không được âm';
      isValid = false;
    }

    return isValid;
  }

  createSalaryForEdit() {
    if (!this.validateAddSalaryForEditForm()) {
      return;
    }

    if (!this.editingStaff?.id) {
      this.error = 'Không tìm thấy ID nhân viên';
      return;
    }

    this.salaryService.createStaffSalary(this.editingStaff.id, this.newSalaryForEdit).subscribe({
      next: () => {
        this.addSalaryForEditDialogVisible = false;
        this.newSalaryForEdit = {};
        this.loadEditSalaries(); // Reload danh sách lương
      },
      error: (err) => {
        if (err.status === 400 && err.error) {
          this.addSalaryForEditErrors = err.error;
        } else {
          this.addSalaryForEditErrors['general'] = 'Lỗi hệ thống: ' + err.message;
        }
      }
    });
  }

  clearAddSalaryForEditError(fieldName: string) {
    delete this.addSalaryForEditErrors[fieldName];
  }

  deleteSalary(salaryId: number) {
    this.confirmationService.confirm({
      message: 'Bạn có chắc chắn muốn xóa bảng lương này không?',
      header: 'Xác nhận xóa',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Xóa',
      rejectLabel: 'Hủy',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.salaryService.deleteStaffSalary(salaryId).subscribe({
          next: () => {
            this.loadEditSalaries(); // Reload danh sách lương
          },
          error: (err) => {
            this.error = 'Không thể xóa bảng lương: ' + err.message;
          }
        });
      }
    });
  }

  openSalaryDialog() {
    if (!this.selectedStaff?.id) return;

    this.salaryLoading = true;
    this.salaryService.getStaffSalary(this.selectedStaff.id).subscribe({
      next: (data) => {
        // Nếu API trả về 1 object thì wrap thành array
        this.staffSalaries = Array.isArray(data) ? data : [data];
        this.salaryLoading = false;
        this.salaryDialogVisible = true;
      },
      error: (err) => {
        this.error = 'Không thể tải thông tin lương: ' + err.message;
        this.salaryLoading = false;
      }
    });
  }
}
