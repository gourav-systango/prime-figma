import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService, User } from '../../../services/auth.service';
import { AddressService, Address } from '../../../services/address.service';
import { AuthGuardService } from '../../../services/auth-guard.service';
import { Router } from '@angular/router';

interface AddressForm extends Omit<Address, 'id'> {}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  // User data
  user: User | null = null;
  
  // Profile editing
  isEditingProfile: boolean = false;
  profileForm: Partial<User> = {};
  profileUpdateSuccess: boolean = false;
  profileUpdateError: string | null = null;
  
  // Address management
  addresses: Address[] = [];
  isAddingAddress: boolean = false;
  isEditingAddress: boolean = false;
  editingAddressId: number | null = null;
  addressForm: AddressForm = this.getEmptyAddressForm();
  addressFormError: string | null = null;
  addressTypes: string[] = [];
  
  // Active tab
  activeTab: 'profile' | 'addresses' = 'profile';
  
  constructor(
    private authService: AuthService,
    private addressService: AddressService,
    private router: Router
  ) {}
  
  ngOnInit(): void {
    // Redirect to home if not authenticated
    if (!this.authService.isAuthenticated()) {
      this.router.navigateByUrl('/');
      return;
    }
    
    // Get current user
    this.user = this.authService.getCurrentUser();
    
    // Get address types
    this.addressTypes = this.addressService.getAddressTypes();
    
    // Initialize form
    this.resetProfileForm();
    
    // Get addresses
    this.addressService.addresses$.subscribe(addresses => {
      this.addresses = addresses;
    });
    
    // Load addresses
    this.addressService.loadUserAddresses();
  }
  
  // Profile methods
  resetProfileForm(): void {
    if (this.user) {
      this.profileForm = {
        name: this.user.name,
        email: this.user.email,
        phone: this.user.phone,
        profilePicture: this.user.profilePicture
      };
    }
  }
  
  startEditingProfile(): void {
    this.isEditingProfile = true;
    this.resetProfileForm();
    this.profileUpdateSuccess = false;
    this.profileUpdateError = null;
  }
  
  cancelEditingProfile(): void {
    this.isEditingProfile = false;
    this.resetProfileForm();
    this.profileUpdateSuccess = false;
    this.profileUpdateError = null;
  }
  
  saveProfile(): void {
    if (!this.user) return;
    
    this.authService.updateUserProfile(this.profileForm).subscribe({
      next: (updatedUser) => {
        this.user = updatedUser;
        this.profileUpdateSuccess = true;
        this.profileUpdateError = null;
        this.isEditingProfile = false;
      },
      error: (error) => {
        this.profileUpdateSuccess = false;
        this.profileUpdateError = error.message || 'Failed to update profile';
      }
    });
  }
  
  // Address methods
  getEmptyAddressForm(): AddressForm {
    return {
      type: 'home',
      name: this.user?.name || '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
      phone: this.user?.phone || '',
      isDefault: false
    };
  }
  
  startAddingAddress(): void {
    this.isAddingAddress = true;
    this.isEditingAddress = false;
    this.editingAddressId = null;
    this.addressForm = this.getEmptyAddressForm();
    this.addressFormError = null;
  }
  
  startEditingAddress(address: Address): void {
    this.isAddingAddress = false;
    this.isEditingAddress = true;
    this.editingAddressId = address.id;
    
    // Copy address to form
    this.addressForm = { ...address };
    this.addressFormError = null;
  }
  
  cancelEditingAddress(): void {
    this.isAddingAddress = false;
    this.isEditingAddress = false;
    this.editingAddressId = null;
    this.addressForm = this.getEmptyAddressForm();
    this.addressFormError = null;
  }
  
  saveAddress(): void {
    if (!this.user) return;
    
    // Validate form
    if (!this.addressForm.street || !this.addressForm.city || !this.addressForm.state || 
        !this.addressForm.zipCode || !this.addressForm.country) {
      this.addressFormError = 'Please fill in all required fields';
      return;
    }
    
    if (this.isAddingAddress) {
      // Add new address
      this.addressService.addAddress(this.addressForm).subscribe({
        next: () => {
          this.cancelEditingAddress();
        },
        error: (error) => {
          this.addressFormError = error.message || 'Failed to add address';
        }
      });
    } else if (this.isEditingAddress && this.editingAddressId !== null) {
      // Update existing address
      this.addressService.updateAddress(this.editingAddressId, this.addressForm).subscribe({
        next: () => {
          this.cancelEditingAddress();
        },
        error: (error) => {
          this.addressFormError = error.message || 'Failed to update address';
        }
      });
    }
  }
  
  deleteAddress(addressId: number): void {
    if (confirm('Are you sure you want to delete this address?')) {
      this.addressService.deleteAddress(addressId).subscribe({
        next: () => {
          // Address deleted
        },
        error: (error) => {
          alert(error.message || 'Failed to delete address');
        }
      });
    }
  }
  
  setDefaultAddress(addressId: number): void {
    this.addressService.setDefaultAddress(addressId).subscribe({
      next: () => {
        // Address set as default
      },
      error: (error) => {
        alert(error.message || 'Failed to set address as default');
      }
    });
  }
  
  // Tab methods
  setActiveTab(tab: 'profile' | 'addresses'): void {
    this.activeTab = tab;
  }
}
