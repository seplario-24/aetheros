/**
 * AETHER OS — 3D PROFILE MENU & ACCOUNT MANAGEMENT
 * Shows Google user photo, name, email, export data,
 * sign out, and permanent account deletion (Sections 156-160).
 */

import { auth } from '../auth/auth.js';
import { store } from '../store/db.js';

export class ProfileMenu {
  constructor(mountContainer, navigateCallback) {
    this.mountContainer = mountContainer;
    this.navigate = navigateCallback;
    this.isOpen = false;
    this.render();
  }

  render() {
    const user = auth.getUser();
    if (!user) {
      this.mountContainer.innerHTML = '';
      return;
    }

    const photoUrl = user.profilePhoto || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(user.email || 'Pilot')}`;
    const initial = (user.displayName || user.email || 'P')[0].toUpperCase();

    this.mountContainer.innerHTML = `
      <div class="profile-widget-anchor" style="position: relative; width: 100%;">
        <!-- Profile Trigger Pill -->
        <div id="profile-trigger-btn" style="display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 6px 10px; border-radius: var(--radius-md); background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.08); cursor: pointer; transition: all var(--transition-fast);">
          <div style="display: flex; align-items: center; gap: 10px; overflow: hidden;">
            <div style="width: 32px; height: 32px; border-radius: 50%; overflow: hidden; border: 1.5px solid var(--accent-primary); box-shadow: 0 0 10px var(--accent-primary-glow); flex-shrink: 0; background: var(--bg-surface-elevated); display: flex; align-items: center; justify-content: center; font-weight: 700; color: #FFFFFF;">
              ${user.profilePhoto ? `<img src="${photoUrl}" alt="Avatar" style="width: 100%; height: 100%; object-fit: cover;">` : initial}
            </div>
            <div style="display: flex; flex-direction: column; overflow: hidden;">
              <span style="font-weight: 700; font-size: 12.5px; color: #FFFFFF; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                ${user.displayName || 'Pilot'}
              </span>
              <span style="font-size: 10px; color: #94A3B8; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                ${user.email}
              </span>
            </div>
          </div>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="color: #94A3B8;"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </div>

        <!-- 3D Profile Popover Card -->
        <div id="profile-popover-card" class="profile-popover-card" style="position: absolute; bottom: calc(100% + 10px); left: 0; right: 0; background: rgba(11, 15, 25, 0.96); backdrop-filter: blur(32px) saturate(2); -webkit-backdrop-filter: blur(32px) saturate(2); border: 1px solid rgba(255, 255, 255, 0.2); border-radius: 18px; padding: 16px; box-shadow: 0 24px 60px -8px rgba(0, 0, 0, 0.85), 0 0 24px rgba(99, 102, 241, 0.2), inset 0 1px 1px rgba(255, 255, 255, 0.3); z-index: 1000; display: none;">
          
          <!-- Header Profile Info -->
          <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 14px; padding-bottom: 12px; border-bottom: 1px solid rgba(255, 255, 255, 0.1);">
            <div style="width: 40px; height: 40px; border-radius: 50%; overflow: hidden; border: 2px solid var(--accent-primary); box-shadow: 0 0 14px var(--accent-primary-glow); flex-shrink: 0; background: var(--bg-surface);">
              ${user.profilePhoto ? `<img src="${photoUrl}" alt="Avatar" style="width: 100%; height: 100%; object-fit: cover;">` : initial}
            </div>
            <div style="display: flex; flex-direction: column; overflow: hidden; text-align: left;">
              <span style="font-weight: 700; font-size: 13.5px; color: #FFFFFF; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                ${user.displayName}
              </span>
              <span style="font-size: 11px; color: #94A3B8; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                ${user.email}
              </span>
              <span style="display: inline-block; font-size: 9.5px; font-weight: 800; color: var(--accent-emerald); text-transform: uppercase; letter-spacing: 0.8px; margin-top: 3px;">
                ● Isolated OS Active
              </span>
            </div>
          </div>

          <!-- Menu Actions -->
          <div style="display: flex; flex-direction: column; gap: 6px;">
            <button id="btn-menu-settings" class="profile-menu-item" style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 8px 12px; border-radius: 8px; background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.06); color: #E2E8F0; font-size: 12.5px; font-weight: 600; cursor: pointer; text-align: left;">
              <span>⚙️</span>
              <span>Workspace Settings</span>
            </button>

            <button id="btn-menu-export" class="profile-menu-item" style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 8px 12px; border-radius: 8px; background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.06); color: #E2E8F0; font-size: 12.5px; font-weight: 600; cursor: pointer; text-align: left;" title="Download all your private tasks, habits, and focus logs as JSON">
              <span>📥</span>
              <span>Export My Data (JSON)</span>
            </button>

            <button id="btn-menu-signout" class="profile-menu-item" style="display: flex; align-items: center; gap: 10px; width: 100%; padding: 8px 12px; border-radius: 8px; background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.25); color: #FCA5A5; font-size: 12.5px; font-weight: 600; cursor: pointer; text-align: left; margin-top: 4px;">
              <span>🚪</span>
              <span>Sign Out</span>
            </button>

            <button id="btn-menu-delete" style="display: flex; align-items: center; gap: 6px; width: 100%; padding: 6px 12px; background: none; border: none; color: #64748B; font-size: 11px; cursor: pointer; text-align: left; margin-top: 2px;">
              <span>🗑️</span>
              <span>Delete My Account</span>
            </button>
          </div>
        </div>
      </div>
    `;

    this.bindEvents();
  }

  bindEvents() {
    const trigger = this.mountContainer.querySelector('#profile-trigger-btn');
    const popover = this.mountContainer.querySelector('#profile-popover-card');

    if (trigger && popover) {
      trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        this.isOpen = !this.isOpen;
        popover.style.display = this.isOpen ? 'block' : 'none';
      });

      document.addEventListener('click', (e) => {
        if (!this.mountContainer.contains(e.target)) {
          this.isOpen = false;
          popover.style.display = 'none';
        }
      });
    }

    const btnSettings = this.mountContainer.querySelector('#btn-menu-settings');
    if (btnSettings) {
      btnSettings.addEventListener('click', () => {
        this.isOpen = false;
        popover.style.display = 'none';
        if (this.navigate) this.navigate('settings');
      });
    }

    const btnExport = this.mountContainer.querySelector('#btn-menu-export');
    if (btnExport) {
      btnExport.addEventListener('click', () => {
        store.exportUserData();
      });
    }

    const btnSignout = this.mountContainer.querySelector('#btn-menu-signout');
    if (btnSignout) {
      btnSignout.addEventListener('click', () => {
        auth.signOut();
      });
    }

    const btnDelete = this.mountContainer.querySelector('#btn-menu-delete');
    if (btnDelete) {
      btnDelete.addEventListener('click', () => {
        if (confirm('Are you absolutely sure you want to permanently delete your personal OS account and all associated tasks, habits, and focus records? This cannot be undone.')) {
          auth.deleteAccount();
        }
      });
    }
  }
}
