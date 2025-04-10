import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AuthService, User } from '../../../services/auth.service';
import { AddressService, Address } from '../../../services/address.service';
import { AuthGuardService } from '../../../services/auth-guard.service';
import { Router } from '@angular/router';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

interface AddressForm extends Omit<Address, 'id'> {}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    RouterModule, 
    DialogModule, 
    ButtonModule,
    ToastModule
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  providers: [MessageService]
})
export class ProfileComponent implements OnInit {
  // User data
  user: User | null = null;
  
  // Profile editing
  isEditingProfile: boolean = false;
  profileForm: Partial<User> = {};
  profileUpdateSuccess: boolean = false;
  profileUpdateError: string | undefined = undefined;
  
  // Address management
  addresses: Address[] = [];
  isAddingAddress: boolean = false;
  isEditingAddress: boolean = false;
  editingAddressId: number | null = null;
  addressForm: AddressForm = this.getEmptyAddressForm();
  addressFormError: string | undefined = undefined;
  addressUpdateSuccess: boolean = false;
  addressUpdateMessage: string | undefined = undefined;
  addressTypes: string[] = [];
  
  // Dialog management
  confirmDialogVisible: boolean = false;
  dialogTitle: string = '';
  dialogMessage: string = '';
  dialogAction: () => void = () => {};
  dialogAddressId?: number;
  
  // Active tab
  activeTab: 'profile' | 'addresses' = 'profile';
  
  constructor(
    private authService: AuthService,
    private addressService: AddressService,
    private router: Router,
    private messageService: MessageService
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
      this.addresses = [...addresses].sort((a, b) => {
        // Sort by default first, then by type, then by name
        if (a.isDefault !== b.isDefault) {
          return a.isDefault ? -1 : 1;
        }
        if (a.type !== b.type) {
          return a.type.localeCompare(b.type);
        }
        return a.name.localeCompare(b.name);
      });
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
    this.profileUpdateError = undefined;
  }
  
  cancelEditingProfile(): void {
    this.isEditingProfile = false;
    this.resetProfileForm();
    this.profileUpdateSuccess = false;
    this.profileUpdateError = undefined;
  }
  
  saveProfile(): void {
    if (!this.user) return;
    
    this.authService.updateUserProfile(this.profileForm).subscribe({
      next: (updatedUser) => {
        this.user = updatedUser;
        this.profileUpdateSuccess = true;
        this.profileUpdateError = undefined;
        this.isEditingProfile = false;
        
        this.messageService.add({
          severity: 'success',
          summary: 'Profile Updated',
          detail: 'Your profile has been successfully updated'
        });
        
        // Automatically hide success message after 5 seconds
        setTimeout(() => {
          this.profileUpdateSuccess = false;
        }, 5000);
      },
      error: (error) => {
        this.profileUpdateSuccess = false;
        this.profileUpdateError = error.message || 'Failed to update profile';
        
        this.messageService.add({
          severity: 'error',
          summary: 'Update Failed',
          detail: this.profileUpdateError
        });
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
      isDefault: this.addresses.length === 0 // Make default if this is the first address
    };
  }
  
  startAddingAddress(): void {
    this.resetAddressMessages();
    this.isAddingAddress = true;
    this.isEditingAddress = false;
    this.editingAddressId = null;
    this.addressForm = this.getEmptyAddressForm();
  }
  
  startEditingAddress(address: Address): void {
    this.resetAddressMessages();
    this.isAddingAddress = false;
    this.isEditingAddress = true;
    this.editingAddressId = address.id;
    
    // Make a deep copy of the address to avoid modifying the original
    this.addressForm = { 
      type: address.type,
      name: address.name,
      street: address.street,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      country: address.country,
      phone: address.phone,
      isDefault: address.isDefault
    };
  }
  
  cancelEditingAddress(): void {
    this.resetAddressMessages();
    this.isAddingAddress = false;
    this.isEditingAddress = false;
    this.editingAddressId = null;
    this.addressForm = this.getEmptyAddressForm();
  }
  
  resetAddressMessages(): void {
    this.addressFormError = undefined;
    this.addressUpdateSuccess = false;
    this.addressUpdateMessage = undefined;
  }
  
  toggleDefaultAddress(value: boolean): void {
    this.addressForm.isDefault = value;
  }
  
  saveAddress(): void {
    if (!this.user) return;
    
    // Validate form
    if (!this.validateAddressForm()) {
      return;
    }
    
    if (this.isAddingAddress) {
      // Add new address
      this.addressService.addAddress(this.addressForm).subscribe({
        next: (newAddress) => {
          this.addressUpdateSuccess = true;
          this.addressUpdateMessage = 'Address added successfully!';
          this.isAddingAddress = false;
          
          this.messageService.add({
            severity: 'success',
            summary: 'Address Added',
            detail: 'Your new address has been successfully added'
          });
          
          // Clear the form after a brief delay to allow the user to see the success message
          setTimeout(() => {
            this.resetAddressMessages();
            this.addressForm = this.getEmptyAddressForm();
          }, 3000);
        },
        error: (error) => {
          this.addressFormError = error.message || 'Failed to add address';
          
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: this.addressFormError
          });
        }
      });
    } else if (this.isEditingAddress && this.editingAddressId !== null) {
      // Update existing address
      this.addressService.updateAddress(this.editingAddressId, this.addressForm).subscribe({
        next: (updatedAddress) => {
          this.addressUpdateSuccess = true;
          this.addressUpdateMessage = 'Address updated successfully!';
          this.isEditingAddress = false;
          this.editingAddressId = null;
          
          this.messageService.add({
            severity: 'success',
            summary: 'Address Updated',
            detail: 'Your address has been successfully updated'
          });
          
          // Clear the form after a brief delay
          setTimeout(() => {
            this.resetAddressMessages();
            this.addressForm = this.getEmptyAddressForm();
          }, 3000);
        },
        error: (error) => {
          this.addressFormError = error.message || 'Failed to update address';
          
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: this.addressFormError
          });
        }
      });
    }
  }
  
  validateAddressForm(): boolean {
    // Reset any previous errors
    this.addressFormError = undefined;
    
    if (!this.addressForm.name?.trim()) {
      this.addressFormError = 'Please enter a name for this address';
      return false;
    }
    
    if (!this.addressForm.street?.trim()) {
      this.addressFormError = 'Please enter a street address';
      return false;
    }
    
    if (!this.addressForm.city?.trim()) {
      this.addressFormError = 'Please enter a city';
      return false;
    }
    
    if (!this.addressForm.state?.trim()) {
      this.addressFormError = 'Please enter a state or province';
      return false;
    }
    
    if (!this.addressForm.zipCode?.trim()) {
      this.addressFormError = 'Please enter a ZIP or postal code';
      return false;
    }
    
    if (!this.addressForm.country?.trim()) {
      this.addressFormError = 'Please enter a country';
      return false;
    }
    
    if (!this.addressForm.phone?.trim()) {
      this.addressFormError = 'Please enter a phone number';
      return false;
    }
    
    return true;
  }
  
  confirmDeleteAddress(addressId: number): void {
    const address = this.addresses.find(a => a.id === addressId);
    if (!address) return;
    
    this.dialogTitle = 'Confirm Delete';
    this.dialogMessage = `Are you sure you want to delete this ${address.type} address for ${address.name}?`;
    this.dialogAddressId = addressId;
    this.dialogAction = () => this.deleteAddress(addressId);
    this.confirmDialogVisible = true;
  }
  
  deleteAddress(addressId: number): void {
    this.confirmDialogVisible = false;
    
    this.addressService.deleteAddress(addressId).subscribe({
      next: () => {
        this.addressUpdateSuccess = true;
        this.addressUpdateMessage = 'Address deleted successfully!';
        
        this.messageService.add({
          severity: 'success',
          summary: 'Address Deleted',
          detail: 'The address has been successfully deleted'
        });
        
        // Hide message after a delay
        setTimeout(() => {
          this.resetAddressMessages();
        }, 3000);
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message || 'Failed to delete address'
        });
      }
    });
  }
  
  confirmSetDefaultAddress(addressId: number): void {
    const address = this.addresses.find(a => a.id === addressId);
    if (!address) return;
    
    this.setDefaultAddress(addressId);
  }
  
  setDefaultAddress(addressId: number): void {
    this.addressService.setDefaultAddress(addressId).subscribe({
      next: (updatedAddress) => {
        this.addressUpdateSuccess = true;
        this.addressUpdateMessage = 'Default address updated!';
        
        this.messageService.add({
          severity: 'success',
          summary: 'Default Address',
          detail: 'Default address has been updated'
        });
        
        // Hide message after a delay
        setTimeout(() => {
          this.resetAddressMessages();
        }, 3000);
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: error.message || 'Failed to set address as default'
        });
      }
    });
  }
  
  // Tab methods
  setActiveTab(tab: 'profile' | 'addresses'): void {
    // Cancel any active forms when switching tabs
    if (this.activeTab !== tab) {
      if (tab === 'profile') {
        this.cancelEditingAddress();
      } else {
        this.cancelEditingProfile();
      }
      
      this.activeTab = tab;
    }
  }
  
  // Dialog methods
  onDialogHide(): void {
    this.confirmDialogVisible = false;
  }
  
  executeDialogAction(): void {
    if (this.dialogAction) {
      this.dialogAction();
    }
  }
}
