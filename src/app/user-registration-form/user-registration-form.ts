import { Component, OnInit, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-registration-form',
  standalone: true,
  imports: [MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, FormsModule],
  templateUrl: './user-registration-form.html',
  styleUrls: ['./user-registration-form.scss']
})
export class UserRegistrationFormComponent implements OnInit {

  @Input() userData = { Username: '', Password: '', Email: '', Birthday: '' };

constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserRegistrationFormComponent>,
    public snackBar: MatSnackBar) { }

ngOnInit(): void {
}

  registerUser(): void {
    // Validate form data before sending
    if (!this.userData.Username || this.userData.Username.length < 5) {
      this.snackBar.open('Username must be at least 5 characters long', 'OK', {
        duration: 3000
      });
      return;
    }
    
    if (!this.userData.Password || this.userData.Password.length < 5) {
      this.snackBar.open('Password must be at least 5 characters long', 'OK', {
        duration: 3000
      });
      return;
    }
    
    if (!this.userData.Email || !this.isValidEmail(this.userData.Email)) {
      this.snackBar.open('Please enter a valid email address', 'OK', {
        duration: 3000
      });
      return;
    }

    this.fetchApiData.userRegistration(this.userData).subscribe({
      next: (result) => {
        this.dialogRef.close(); 
        this.snackBar.open('Registration successful!', 'OK', {
          duration: 2000
        });
      },
      error: (error) => {
        console.error('Registration error:', error);
        let errorMessage = 'Registration failed. Please try again.';
        
        if (error.error && error.error.errors) {
          // Handle validation errors from backend
          const validationErrors = error.error.errors.map((err: any) => err.msg).join(', ');
          errorMessage = `Validation error: ${validationErrors}`;
        } else if (error.error && error.error.message) {
          errorMessage = error.error.message;
        }
        
        this.snackBar.open(errorMessage, 'OK', {
          duration: 5000
        });
      }
    });
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  }