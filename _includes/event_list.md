### System Log Categories

<table style="table-layout-fixed table-layout-fixed-events">
    
    <col width="377px" />
    <col width="309px" />
    <thead>
        <tr>
            <th>ObjectType</th>
            <th>Description</th>
        </tr>
    </thead>
<tbody>
<tr>
    <td>system_log_category.&#8203;app_assignment</td>
    <td>Application Assignment</td>
</tr>
<tr>
    <td>system_log_category.&#8203;app_access</td>
    <td>Application Access</td>
</tr>
<tr>
    <td>system_log_category.&#8203;ad_agent</td>
    <td>Active Directory Agent</td>
</tr>
<tr>
    <td>system_log_category.&#8203;ldap_agent</td>
    <td>LDAP Agent</td>
</tr>
<tr>
    <td>system_log_category.&#8203;user_creation</td>
    <td>User Creation</td>
</tr>
<tr>
    <td>system_log_category.&#8203;user_creation_failure</td>
    <td>User Creation Failure</td>
</tr>
<tr>
    <td>system_log_category.&#8203;user_activation</td>
    <td>User Activation</td>
</tr>
<tr>
    <td>system_log_category.&#8203;user_deactivation</td>
    <td>User Deactivation</td>
</tr>
<tr>
    <td>system_log_category.&#8203;user_locked_out</td>
    <td>User Locked Out</td>
</tr>
<tr>
    <td>system_log_category.&#8203;signin_failure</td>
    <td>Sign-in Failure</td>
</tr>
<tr>
    <td>system_log_category.&#8203;signin_success</td>
    <td>Sign-in Success</td>
</tr>
<tr>
    <td>system_log_category.&#8203;suspicious_activity</td>
    <td>Suspicious Activity</td>
</tr>
<tr>
    <td>system_log_category.&#8203;app_import_summary</td>
    <td>Application Imports (Summary)</td>
</tr>
<tr>
    <td>system_log_category.&#8203;app_import_details</td>
    <td>Application Imports (Detailed)</td>
</tr>
<tr>
    <td>system_log_category.&#8203;sms_messages</td>
    <td>SMS Messages</td>
</tr>
<tr>
    <td>system_log_category.&#8203;email_messages</td>
    <td>Email Messages</td>
</tr>
<tr>
    <td>system_log_category.&#8203;universal_directory</td>
    <td>Universal Directory</td>
</tr>
<tr>
    <td>system_log_category.&#8203;idp_authentication</td>
    <td>IDP Authentication</td>
</tr>
<tr>
    <td>system_log_category.&#8203;token_lifecycle</td>
    <td>Token Lifecycle</td>
</tr>
<tr>
    <td>system_log_category.&#8203;directory_agent_action</td>
    <td>Directory Agent Actions</td>
</tr>
<tr>
    <td>system_log_category.&#8203;policy_lifecycle</td>
    <td>Policy Lifecycle</td>
</tr>
<tr>
    <td>system_log_category.&#8203;user_self_service_unlock</td>
    <td>Self Service Unlock</td>
</tr>
<tr>
    <td>system_log_category.&#8203;user_self_service_password_reset</td>
    <td>Self Service Password Reset</td>
</tr>
<tr>
    <td>system_log_category.&#8203;user_profile_update</td>
    <td>User Profile Update</td>
</tr>
<tr>
    <td>system_log_category.&#8203;app_provision_failure</td>
    <td>App Provisioning Failure</td>
</tr>
</tbody></table>

### User

#### Auth

<table style="table-layout-fixed table-layout-fixed-events">
    
    <col width="377px" />
    <col width="309px" />
    <thead>
        <tr>
            <th>ObjectType</th>
            <th>Description</th>
        </tr>
    </thead>
<tbody>
<tr>
    <td>core.&#8203;user_auth.&#8203;login_failed.&#8203;invalid_credentials</td>
    <td>Sign-in Failed - Invalid Credentials</td>
</tr>
<tr>
    <td>core.&#8203;user_auth.&#8203;login_failed.&#8203;locked_out</td>
    <td>Sign-in Failed - User is currently locked out</td>
</tr>
<tr>
    <td>core.&#8203;user_auth.&#8203;login_failed.&#8203;unknown_user</td>
    <td>Sign-in Failed - Unknown User '${okta_username}'</td>
</tr>
<tr>
    <td>core.&#8203;user_auth.&#8203;login_failed.&#8203;not_activated</td>
    <td>Sign-in Failed - User not activated</td>
</tr>
<tr>
    <td>core.&#8203;user_auth.&#8203;login_failed.&#8203;pending_activation</td>
    <td>Sign-in Failed - User pending activation</td>
</tr>
<tr>
    <td>core.&#8203;user_auth.&#8203;login_failed.&#8203;not_verified</td>
    <td>Sign-in Failed - Not Verified</td>
</tr>
<tr>
    <td>core.&#8203;user_auth.&#8203;login_failed.&#8203;service_not_available</td>
    <td>Sign-in Failed - Service not available</td>
</tr>
<tr>
    <td>core.&#8203;user_auth.&#8203;login_failed.&#8203;general_nonsuccess</td>
    <td>Sign-in Failed</td>
</tr>
<tr>
    <td>core.&#8203;user_auth.&#8203;login_failed.&#8203;temp_login</td>
    <td>Sign-in Failed - Temp login</td>
</tr>
<tr>
    <td>core.&#8203;user_auth.&#8203;login_failed.&#8203;additional_credentials_required</td>
    <td>Sign-in Failed - Additional credentials required</td>
</tr>
<tr>
    <td>core.&#8203;user_auth.&#8203;login_failed.&#8203;del_auth_timeout</td>
    <td>Sign-in Failed - AD authentication connection failed</td>
</tr>
<tr>
    <td>core.&#8203;user_auth.&#8203;login_failed.&#8203;del_auth_no_connected_agents</td>
    <td>Sign-in Failed - No connected agents found</td>
</tr>
<tr>
    <td>core.&#8203;user_auth.&#8203;login_failed.&#8203;sso_authentication_failure</td>
    <td>Sign-in Failed - SSO authentication failed</td>
</tr>
<tr>
    <td>core.&#8203;user_auth.&#8203;login_failed.&#8203;inactive_org</td>
    <td>Sign-in Failed - Org is inactive</td>
</tr>
<tr>
    <td>core.&#8203;user_auth.&#8203;login_failed.&#8203;password_based_login_disallowed</td>
    <td>Sign-in Failed - Password based login not allowed</td>
</tr>
<tr>
    <td>core.&#8203;user_auth.&#8203;login_failed.&#8203;password_expired</td>
    <td>Sign-In Failed - Password has expired</td>
</tr>
<tr>
    <td>core.&#8203;user_auth.&#8203;login_failed.&#8203;not_specified</td>
    <td>Sign-in Failed - Not Specified</td>
</tr>
<tr>
    <td>core.&#8203;user_auth.&#8203;login_failed.&#8203;sunone_password_expired</td>
    <td>Sign-In Failed - Password has expired</td>
</tr>
<tr>
    <td>core.&#8203;user_auth.&#8203;login_failed.&#8203;verification_error</td>
    <td>Sign-In Failed - Verification failed for user: ${okta_username}</td>
</tr>
<tr>
    <td>core.&#8203;user_auth.&#8203;login_denied</td>
    <td>Sign-In Denied - Login is not allowed for the user.</td>
</tr>
<tr>
    <td>core.&#8203;user_auth.&#8203;login_success</td>
    <td>Sign-in successful</td>
</tr>
<tr>
    <td>core.&#8203;user_auth.&#8203;logout_success</td>
    <td>Sign-out successful</td>
</tr>
<tr>
    <td>core.&#8203;user_auth.&#8203;account_auto_unlocked</td>
    <td>Account automatically unlocked</td>
</tr>
<tr>
    <td>core.&#8203;user_auth.&#8203;account_locked</td>
    <td>Account Locked - Max sign-in attempts exceeded.</td>
</tr>
<tr>
    <td>core.&#8203;user_auth.&#8203;mfa_bypass_attempted</td>
    <td>A bypass of MFA may have been attempted for this user</td>
</tr>
<tr>
    <td>core.&#8203;user_auth.&#8203;session_expired</td>
    <td>Session has expired</td>
</tr>
<tr>
    <td>core.&#8203;user_auth.&#8203;account_not_found</td>
    <td>Account was not found</td>
</tr>
<tr>
    <td>core.user_auth.radius.login.succeeded</td>
    <td>Login from Radius Agent succeeded. Client address: ${client_address} Client ID: ${client_id}</td>
</tr>
<tr>
    <td>core.user_auth.radius.login.failed</td>
    <td>Login from Radius Agent failed. Client address: ${client_address} Client ID: ${client_id}</td>
</tr>
</tbody></table>

#### Factors

<table style="table-layout-fixed table-layout-fixed-events">
    
    <col width="377px" />
    <col width="309px" />
    <thead>
        <tr>
            <th>ObjectType</th>
            <th>Description</th>
        </tr>
    </thead>
<tbody>
<tr>
    <td>core.&#8203;user.&#8203;factor.&#8203;activate</td>
    <td>User set up ${factor} factor</td>
</tr>
<tr>
    <td>core.&#8203;user.&#8203;factor.&#8203;deactivate</td>
    <td>User reset ${factor} factor</td>
</tr>
<tr>
    <td>core.&#8203;user.&#8203;factor.&#8203;update</td>
    <td>User updated ${factor} factor</td>
</tr>
<tr>
    <td>core.&#8203;user.&#8203;factor.&#8203;reset_all</td>
    <td>All additional factors reset for user</td>
</tr>
<tr>
    <td>core.&#8203;user.&#8203;factor.&#8203;attempt_fail</td>
    <td>Failed ${factor} factor attempt</td>
</tr>
<tr>
    <td>core.&#8203;user.&#8203;factor.&#8203;attempt_success</td>
    <td>Successful ${factor} factor attempt</td>
</tr>
<tr>
    <td>core.&#8203;user_auth.&#8203;self_service.&#8203;invalid_recovery_token</td>
    <td>Invalid recovery token was attempted for self-service operation: ${recovery_token}</td>
</tr>
</tbody></table>

#### User Activity Report

<table style="table-layout-fixed table-layout-fixed-events">
    
    <col width="377px" />
    <col width="309px" />
    <thead>
        <tr>
            <th>ObjectType</th>
            <th>Description</th>
        </tr>
    </thead>
<tbody>
<tr>
    <td>user_activity.&#8203;core.&#8203;user_auth.&#8203;login_success</td>
    <td>Sign-in</td>
</tr>
<tr>
    <td>user_activity.&#8203;core.&#8203;user_auth.&#8203;logout_success</td>
    <td>Sign-out</td>
</tr>
<tr>
    <td>user_activity.&#8203;core.&#8203;user_auth.&#8203;session_expired</td>
    <td>SessionExpired</td>
</tr>
<tr>
    <td>user_activity.&#8203;app.&#8203;auth.&#8203;sso</td>
    <td>SingleSignOn</td>
</tr>
<tr>
    <td>user_activity.&#8203;clickstream.&#8203;request.&#8203;complete</td>
    <td>RequestComplete</td>
</tr>
</tbody></table>

#### Password Reset

<table style="table-layout-fixed table-layout-fixed-events">
    
    <col width="377px" />
    <col width="309px" />
    <thead>
        <tr>
            <th>ObjectType</th>
            <th>Description</th>
        </tr>
    </thead>
<tbody>
<tr>
    <td>core.&#8203;user_auth.&#8203;self_service.&#8203;password_reset.&#8203;unknown_user</td>
    <td>Self-service password reset attempted for unknown user: ${okta_username}</td>
</tr>
<tr>
    <td>core.&#8203;user_auth.&#8203;self_service.&#8203;password_reset.&#8203;issued_recovery_token</td>
    <td>Issued recovery token for self-service password reset. Token expires at ${token_expiration_time}</td>
</tr>
<tr>
    <td>core.&#8203;user_auth.&#8203;self_service.&#8203;password_reset.&#8203;invalid_security_answer</td>
    <td>User answered recovery question incorrectly for self-service password reset</td>
</tr>
<tr>
    <td>core.&#8203;user_auth.&#8203;self_service.&#8203;password_reset.&#8203;invalid_recovery_token</td>
    <td>Invalid recovery token was attempted for self-service password reset: ${recovery_token}</td>
</tr>
<tr>
    <td>core.&#8203;user_auth.&#8203;self_service.&#8203;password_reset.&#8203;invalid_sms_code</td>
    <td>Invalid SMS code was attempted for self-service password reset</td>
</tr>
<tr>
    <td>core.&#8203;user_auth.&#8203;self_service.&#8203;password_reset</td>
    <td>Password reset using self-service</td>
</tr>
</tbody></table>

#### Account Unlock

<table style="table-layout-fixed table-layout-fixed-events">
    
    <col width="377px" />
    <col width="309px" />
    <thead>
        <tr>
            <th>ObjectType</th>
            <th>Description</th>
        </tr>
    </thead>
<tbody>
<tr>
    <td>core.&#8203;user_auth.&#8203;self_service.&#8203;account_unlock.&#8203;already_unlocked</td>
    <td>Self-service account unlock attempted for account that was already unlocked</td>
</tr>
<tr>
    <td>core.&#8203;user_auth.&#8203;self_service.&#8203;account_unlock.&#8203;unknown_user</td>
    <td>Self-service account unlock attempted for unknown user: ${okta_username}</td>
</tr>
<tr>
    <td>core.&#8203;user_auth.&#8203;self_service.&#8203;account_unlock.&#8203;issued_recovery_token</td>
    <td>Issued recovery token for self-service account unlock. Token expires at ${token_expiration_time}</td>
</tr>
<tr>
    <td>core.&#8203;user_auth.&#8203;self_service.&#8203;account_unlock.&#8203;invalid_security_answer</td>
    <td>User answered recovery question incorrectly for self-service account unlock</td>
</tr>
<tr>
    <td>core.&#8203;user_auth.&#8203;self_service.&#8203;account_unlock.&#8203;invalid_recovery_token</td>
    <td>Invalid recovery token was attempted for self-service account unlock: ${recovery_token}</td>
</tr>
<tr>
    <td>core.&#8203;user_auth.&#8203;self_service.&#8203;account_unlock.&#8203;invalid_sms_code</td>
    <td>Invalid SMS code was attempted for self-service account unlock</td>
</tr>
<tr>
    <td>core.&#8203;user_auth.&#8203;self_service.&#8203;account_unlock</td>
    <td>Account unlocked using self-service</td>
</tr>
</tbody></table>

#### Config

<table style="table-layout-fixed table-layout-fixed-events">
    
    <col width="377px" />
    <col width="309px" />
    <thead>
        <tr>
            <th>ObjectType</th>
            <th>Description</th>
        </tr>
    </thead>
<tbody>
<tr>
    <td>cvd.&#8203;user_profile_bootstrapped</td>
    <td>User profile bootstrapped (Profile: ${profile_id})</td>
</tr>
<tr>
    <td>cvd.user_profile_updated</td>
    <td>User profile updated (Profile: ${profile_id}, Attributes Added: [${profile_properties_added}], Attributes Deleted: [${profile_properties_deleted}])</td>
</tr>
<tr>
    <td>cvd.mappings_updated</td>
    <td>${direction} (Source profile: ${source}, Target profile: ${target}, Added: [${mappings_added}], Modified: [${mappings_modified}], Deleted: [${mappings_deleted}])</td>
</tr>
<tr>
    <td>cvd.&#8203;appuser_profile_bootstrapped</td>
    <td>Application User profile bootstrapped (Profile: ${profile_id})</td>
</tr>
<tr>
    <td>cvd.appuser_profile_updated</td>
    <td>Application User profile updated (Profile: ${profile_id}, Attributes Added: [${profile_properties_added}], Attributes Deleted: [${profile_properties_deleted}])</td>
</tr>
<tr>
    <td>core.&#8203;user.&#8203;config.&#8203;password_update.&#8203;success</td>
    <td>User updated their Okta password</td>
</tr>
<tr>
    <td>core.&#8203;user.&#8203;config.&#8203;password_update.&#8203;failure</td>
    <td>User failed to update their okta password. ${reason}</td>
</tr>
<tr>
    <td>core.&#8203;user.&#8203;config.&#8203;user_activated</td>
    <td>Okta user has been activated</td>
</tr>
<tr>
    <td>core.&#8203;user.&#8203;config.&#8203;user_deactivated</td>
    <td>Okta user has been deactivated</td>
</tr>
<tr>
    <td>core.&#8203;user.&#8203;config.&#8203;user_status.&#8203;password_reset</td>
    <td>Admin has reset user's password</td>
</tr>
<tr>
    <td>core.&#8203;user.&#8203;config.&#8203;user_creation.&#8203;success</td>
    <td>Okta user created</td>
</tr>
<tr>
    <td>core.&#8203;user.&#8203;config.&#8203;user_creation.&#8203;failure</td>
    <td>Okta user creation failed for ${login} ${validation_errors}</td>
</tr>
<tr>
    <td>core.&#8203;user.&#8203;config.&#8203;user_reactivation.&#8203;success</td>
    <td>Okta User reinstated from deactivated status</td>
</tr>
<tr>
    <td>core.&#8203;user.&#8203;config.&#8203;profile_update.&#8203;success</td>
    <td>Okta User profile updated</td>
</tr>
<tr>
    <td>core.&#8203;user.&#8203;jit.&#8203;error.&#8203;read_only</td>
    <td>Failed to JIT create user '${okta_username}' - system is in ${server_status} mode</td>
</tr>
</tbody></table>

#### SMS

<table style="table-layout-fixed table-layout-fixed-events">
    
    <col width="377px" />
    <col width="309px" />
    <thead>
        <tr>
            <th>ObjectType</th>
            <th>Description</th>
        </tr>
    </thead>
<tbody>
<tr>
    <td>core.&#8203;user.&#8203;sms.&#8203;message_sent.&#8203;factor</td>
    <td>SMS sent for second factor: ${phonenumber}</td>
</tr>
<tr>
    <td>core.&#8203;user.&#8203;sms.&#8203;message_sent.&#8203;verify</td>
    <td>SMS sent to verify user's phone number: ${phonenumber}</td>
</tr>
<tr>
    <td>core.&#8203;user.&#8203;sms.&#8203;message_sent.&#8203;self_service.&#8203;password_reset</td>
    <td>SMS sent to initiate self-service password reset: ${phonenumber}</td>
</tr>
<tr>
    <td>core.&#8203;user.&#8203;sms.&#8203;message_sent.&#8203;self_service.&#8203;account_unlock</td>
    <td>SMS sent to initiate self-service account unlock: ${phonenumber}</td>
</tr>
<tr>
    <td>core.&#8203;user.&#8203;sms.&#8203;message_sent.&#8203;push_verify.&#8203;activation</td>
    <td>SMS sent to activate Okta Verify Push on mobile: ${phonenumber}</td>
</tr>
</tbody></table>

#### Email

<table style="table-layout-fixed table-layout-fixed-events">
    
    <col width="377px" />
    <col width="309px" />
    <thead>
        <tr>
            <th>ObjectType</th>
            <th>Description</th>
        </tr>
    </thead>
<tbody>
<tr>
    <td>core.&#8203;user.&#8203;email.&#8203;message_sent.&#8203;self_service.&#8203;password_reset</td>
    <td>Email sent to initiate self-service password reset: ${address}</td>
</tr>
<tr>
    <td>core.&#8203;user.&#8203;email.&#8203;message_sent.&#8203;self_service.&#8203;account_unlock</td>
    <td>Email sent to initiate self-service account unlock: ${address}</td>
</tr>
</tbody></table>

#### Impersonation

<table style="table-layout-fixed table-layout-fixed-events">
    
    <col width="377px" />
    <col width="309px" />
    <thead>
        <tr>
            <th>ObjectType</th>
            <th>Description</th>
        </tr>
    </thead>
<tbody>
<tr>
    <td>core.&#8203;user.&#8203;impersonation.&#8203;session.&#8203;initiated</td>
    <td>Impersonation session initiated</td>
</tr>
<tr>
    <td>core.&#8203;user.&#8203;impersonation.&#8203;session.&#8203;ended</td>
    <td>Impersonation session ended</td>
</tr>
<tr>
    <td>core.&#8203;user.&#8203;impersonation.&#8203;grant.&#8203;enabled</td>
    <td>Impersonation grant enabled</td>
</tr>
<tr>
    <td>core.&#8203;user.&#8203;impersonation.&#8203;grant.&#8203;extended</td>
    <td>Impersonation grant extended</td>
</tr>
<tr>
    <td>core.&#8203;user.&#8203;impersonation.&#8203;grant.&#8203;revoked</td>
    <td>Impersonation grant revoked</td>
</tr>
</tbody></table>

#### Privileges

<table style="table-layout-fixed table-layout-fixed-events">
    
    <col width="377px" />
    <col width="309px" />
    <thead>
        <tr>
            <th>ObjectType</th>
            <th>Description</th>
        </tr>
    </thead>
<tbody>
<tr>
    <td>core.&#8203;user.&#8203;admin_privilege.&#8203;granted</td>
    <td>${privilege_granted} privileges granted</td>
</tr>
<tr>
    <td>core.&#8203;user.&#8203;admin_privilege.&#8203;revoked</td>
    <td>Revoked all administrator privileges</td>
</tr>
</tbody></table>

#### Groups

<table style="table-layout-fixed table-layout-fixed-events">
    
    <col width="377px" />
    <col width="309px" />
    <thead>
        <tr>
            <th>ObjectType</th>
            <th>Description</th>
        </tr>
    </thead>
<tbody>
<tr>
    <td>core.&#8203;user_group_member.&#8203;user_add</td>
    <td>User added to group ${group_name}</td>
</tr>
<tr>
    <td>core.&#8203;user_group_member.&#8203;user_remove</td>
    <td>User removed from group ${group_name}</td>
</tr>
<tr>
    <td>core.&#8203;org.&#8203;config.&#8203;org_creation.&#8203;success</td>
    <td>Org created</td>
</tr>
</tbody></table>

### API

#### Exceptions

<table style="table-layout-fixed table-layout-fixed-events">
    
    <col width="377px" />
    <col width="309px" />
    <thead>
        <tr>
            <th>ObjectType</th>
            <th>Description</th>
        </tr>
    </thead>
<tbody>
<tr>
    <td>api.&#8203;error.&#8203;logged_event.&#8203;exception</td>
    <td>API Error: Event Exception</td>
</tr>
<tr>
    <td>api.&#8203;error.&#8203;logged_event.&#8203;unknown_exception</td>
    <td>API Error: Unknown Exception</td>
</tr>
</tbody></table>

#### Token Lifecycle

<table style="table-layout-fixed table-layout-fixed-events">
    
    <col width="377px" />
    <col width="309px" />
    <thead>
        <tr>
            <th>ObjectType</th>
            <th>Description</th>
        </tr>
    </thead>
<tbody>
<tr>
    <td>api.&#8203;token.&#8203;revoke</td>
    <td>API Token revoked ${clientAppMessage}</td>
</tr>
<tr>
    <td>api.&#8203;token.&#8203;enable</td>
    <td>API Token enabled</td>
</tr>
<tr>
    <td>api.&#8203;token.&#8203;create</td>
    <td>API Token created ${clientAppMessage}</td>
</tr>
<tr>
    <td>api.&#8203;token.&#8203;client_app_message</td>
    <td>for client application ${clientAppName}</td>
</tr>
</tbody></table>

### Policy

#### Lifecycle

<table style="table-layout-fixed table-layout-fixed-events">
    
    <col width="377px" />
    <col width="309px" />
    <thead>
        <tr>
            <th>ObjectType</th>
            <th>Description</th>
        </tr>
    </thead>
<tbody>
<tr>
    <td>policy.&#8203;created</td>
    <td>Policy created (id: ${policyId}, type: ${policyType})</td>
</tr>
<tr>
    <td>policy.&#8203;activated</td>
    <td>Policy activated (id: ${policyId}, type: ${policyType})</td>
</tr>
<tr>
    <td>policy.&#8203;deactivated</td>
    <td>Policy deactivated (id: ${policyId}, type: ${policyType})</td>
</tr>
<tr>
    <td>policy.&#8203;updated</td>
    <td>Policy updated (id: ${policyId}, type: ${policyType})</td>
</tr>
<tr>
    <td>policy.&#8203;deleted</td>
    <td>Policy deleted (id: ${policyId}, type: ${policyType})</td>
</tr>
</tbody></table>

#### Rules

<table style="table-layout-fixed table-layout-fixed-events">
    
    <col width="377px" />
    <col width="309px" />
    <thead>
        <tr>
            <th>ObjectType</th>
            <th>Description</th>
        </tr>
    </thead>
<tbody>
<tr>
    <td>policy.&#8203;rule.&#8203;added</td>
    <td>Policy rule (id: ${policyRuleId}, type: ${policyRuleType}) added to Policy (id: ${policyId}, type: ${policyType})</td>
</tr>
<tr>
    <td>policy.&#8203;rule.&#8203;activated</td>
    <td>Policy rule (id: ${policyRuleId}, type: ${policyRuleType}) activated in Policy (id: ${policyId}, type: ${policyType})</td>
</tr>
<tr>
    <td>policy.&#8203;rule.&#8203;deactivated</td>
    <td>Policy rule (id: ${policyRuleId}, type: ${policyRuleType}) deactivated in Policy (id: ${policyId}, type: ${policyType})</td>
</tr>
<tr>
    <td>policy.&#8203;rule.&#8203;updated</td>
    <td>Policy rule (id: ${policyRuleId}, type: ${policyRuleType}) updated in Policy (id: ${policyId}, type: ${policyType})</td>
</tr>
<tr>
    <td>policy.&#8203;rule.&#8203;deleted</td>
    <td>Policy rule (id: ${policyRuleId}, type: ${policyRuleType}) deleted from Policy (id: ${policyId}, type: ${policyType})</td>
</tr>
</tbody></table>

### Apps

#### Provisioning

<table style="table-layout-fixed table-layout-fixed-events">
    
    <col width="377px" />
    <col width="309px" />
    <thead>
        <tr>
            <th>ObjectType</th>
            <th>Description</th>
        </tr>
    </thead>
<tbody>
<tr>
    <td>app.&#8203;user_management.&#8203;push_password_update</td>
    <td>Pushing User's password to app</td>
</tr>
<tr>
    <td>app.&#8203;user_management.&#8203;push_profile_update</td>
    <td>Pushing User's Profile to app</td>
</tr>
<tr>
    <td>app.&#8203;user_management.&#8203;push_profile_success</td>
    <td>Successfully pushed User's Profile to App</td>
</tr>
<tr>
    <td>app.&#8203;user_management.&#8203;push_profile_failure</td>
    <td>Failed to push User's Profile to App</td>
</tr>
<tr>
    <td>app.&#8203;user_management.&#8203;push_new_user</td>
    <td>Pushing new user account to app</td>
</tr>
<tr>
    <td>app.&#8203;user_management.&#8203;provision_user</td>
    <td>Synchronizing user with app</td>
</tr>
<tr>
    <td>app.&#8203;user_management.&#8203;push_pending_user</td>
    <td>Pushing new pending user account to app</td>
</tr>
<tr>
    <td>app.&#8203;user_management.&#8203;activate_user</td>
    <td>Activating new user account in app</td>
</tr>
<tr>
    <td>app.&#8203;user_management.&#8203;importing_profile</td>
    <td>Importing profile for user from app</td>
</tr>
<tr>
    <td>app.&#8203;user_management.&#8203;importing_profile_failed.&#8203;email_length</td>
    <td>Skip importing profile for user from app due to email address too long: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;user_management.&#8203;import.&#8203;csv.&#8203;line.&#8203;error</td>
    <td>Error reading line from CSV: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;user_management.&#8203;import.&#8203;csv.&#8203;header.&#8203;error</td>
    <td>CSV Header does not match template: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;user_management.&#8203;import.&#8203;csv.&#8203;parse.&#8203;error</td>
    <td>Unable to parse CSV file</td>
</tr>
<tr>
    <td>app.&#8203;user_management.&#8203;verified_user_with_thirdparty</td>
    <td>Verified user exists in app</td>
</tr>
<tr>
    <td>app.&#8203;user_management.&#8203;provision_user_failed</td>
    <td>Could not synchronize user with app</td>
</tr>
<tr>
    <td>app.&#8203;user_management.&#8203;updating_api_credentials_for_password_change</td>
    <td>API user has changed their password, updating API credentials to match</td>
</tr>
<tr>
    <td>app.&#8203;user_management.&#8203;deactivate_user</td>
    <td>User deactivation was pushed to app</td>
</tr>
<tr>
    <td>app.&#8203;user_management.&#8203;reactivate_user</td>
    <td>User was reactivated in app</td>
</tr>
<tr>
    <td>app.&#8203;user_management.&#8203;provision_user.&#8203;user_inactive</td>
    <td>Could not reactivate user in app</td>
</tr>
<tr>
    <td>app.&#8203;user_management.&#8203;deactivate_user.&#8203;api_account</td>
    <td>Could not deactivate user. This user is the API user</td>
</tr>
<tr>
    <td>app.&#8203;user_management.&#8203;update_from_master_failed</td>
    <td>Could not apply import: ${message}</td>
</tr>
<tr>
    <td>app.&#8203;user_management.&#8203;app_group_member_import.&#8203;insert_success</td>
    <td>Imported new member of the ${app_group_name} app group - ${app_username}</td>
</tr>
<tr>
    <td>app.&#8203;user_management.&#8203;app_group_member_import.&#8203;delete_success</td>
    <td>Deleted member of the ${app_group_name} app group - ${app_username}</td>
</tr>
<tr>
    <td>app.&#8203;user_management.&#8203;user_group_import.&#8203;upsert_success</td>
    <td>Imported the ${user_group_name} group from app</td>
</tr>
<tr>
    <td>app.&#8203;user_management.&#8203;user_group_import.&#8203;delete_success</td>
    <td>Deleted the ${user_group_name} group from app</td>
</tr>
<tr>
    <td>app.&#8203;user_management.&#8203;app_group_group_member_import.&#8203;insert_success</td>
    <td>Imported new group member of the ${parent_app_group_name} app group - ${child_app_group_name}</td>
</tr>
<tr>
    <td>app.&#8203;user_management.&#8203;app_group_group_member_import.&#8203;delete_success</td>
    <td>Deleted group member of the ${parent_app_group_name} app group - ${child_app_group_name}</td>
</tr>
</tbody></table>

#### Deprovisioning

<table style="table-layout-fixed table-layout-fixed-events">
    
    <col width="377px" />
    <col width="309px" />
    <thead>
        <tr>
            <th>ObjectType</th>
            <th>Description</th>
        </tr>
    </thead>
<tbody>
<tr>
    <td>app.&#8203;user_management.&#8203;deprovision_task_complete</td>
    <td>Deprovision task completed${empty app_username ? '' : ssfn:concat(' for user ', app_username)}</td>
</tr>
</tbody></table>

#### Generic

<table style="table-layout-fixed table-layout-fixed-events">
    
    <col width="377px" />
    <col width="309px" />
    <thead>
        <tr>
            <th>ObjectType</th>
            <th>Description</th>
        </tr>
    </thead>
<tbody>
<tr>
    <td>appLoginFailed</td>
    <td>Cannot connect. Please ensure all details are set correctly.</td>
</tr>
<tr>
    <td>verificationFailed</td>
    <td>Verification failed: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;api.&#8203;error.&#8203;api.&#8203;validation</td>
    <td>Failed to validate Admin credentials: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;api.&#8203;error.&#8203;auth</td>
    <td>Error authenticating: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;api.&#8203;error.&#8203;oauth.&#8203;get.&#8203;token</td>
    <td>Error while retrieving OAuth token: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;api.&#8203;error.&#8203;oauth.&#8203;refresh.&#8203;token</td>
    <td>Error while refreshing OAuth token: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;api.&#8203;error.&#8203;user.&#8203;not_found</td>
    <td>User ${app_username} was not found in ${app_name}</td>
</tr>
<tr>
    <td>app.&#8203;api.&#8203;error.&#8203;group.&#8203;not_found</td>
    <td>Group ${group_name} was not found in ${app_name}</td>
</tr>
<tr>
    <td>app.&#8203;api.&#8203;error.&#8203;user.&#8203;more_than_one_with_same_id</td>
    <td>More than one user was found for ID: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;api.&#8203;error.&#8203;group.&#8203;more_than_one_with_same_id</td>
    <td>More than one group was found for ID: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;api.&#8203;error.&#8203;check_user_exists</td>
    <td>Error while verifying if user exists: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;api.&#8203;error.&#8203;create_user</td>
    <td>Error while creating user: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;api.&#8203;error.&#8203;deactivate_user</td>
    <td>Error while deactivating user: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;api.&#8203;error.&#8203;reactivate_user</td>
    <td>Error while reactivating user: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;api.&#8203;error.&#8203;import_user_profile</td>
    <td>Error while trying to import user profile: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;api.&#8203;error.&#8203;push_profile_update</td>
    <td>Error while trying to push profile update: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;api.&#8203;error.&#8203;push_password_update</td>
    <td>Error pushing password: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;api.&#8203;error.&#8203;upsert_group</td>
    <td>Error while creating user group: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;api.&#8203;error.&#8203;group_name_long_length</td>
    <td>Group name is too long: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;api.&#8203;error.&#8203;upsert_group_duplicate</td>
    <td>User group already exists: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;api.&#8203;error.&#8203;delete_group</td>
    <td>Error while deleting user group: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;api.&#8203;error.&#8203;update_group_membership</td>
    <td>Error while updating user group membership for group: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;api.&#8203;error.&#8203;add_group_membership</td>
    <td>Error while adding user(s) to group: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;api.&#8203;error.&#8203;remove_group_membership</td>
    <td>Error while removing user(s) from group: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;api.&#8203;error.&#8203;download_users</td>
    <td>Error while downloading all users: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;api.&#8203;error.&#8203;download_custom_objects</td>
    <td>Error while downloading custom objects: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;api.&#8203;error.&#8203;get_group_by_id</td>
    <td>Error while trying to find an individual group by id: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;api.&#8203;error.&#8203;download_groups</td>
    <td>Error while downloading all groups: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;api.&#8203;error.&#8203;download_memberships</td>
    <td>Error while downloading users for group: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;api.&#8203;error.&#8203;generic</td>
    <td>API error: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;api.&#8203;error.&#8203;rate.&#8203;limit.&#8203;exceeded</td>
    <td>API rate limit exceeded. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;api.&#8203;error.&#8203;empty_password</td>
    <td>User password cannot be empty</td>
</tr>
<tr>
    <td>app.&#8203;api.&#8203;error.&#8203;download_app_schema</td>
    <td>Error while downloading app schemas: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;generic.&#8203;provision.&#8203;assign_user_to_app</td>
    <td>User provisioned to app</td>
</tr>
<tr>
    <td>app.&#8203;generic.&#8203;provision.&#8203;deactivate_user_from_app</td>
    <td>User deprovisioned from app</td>
</tr>
<tr>
    <td>app.&#8203;generic.&#8203;config.&#8203;app_activated</td>
    <td>App activated</td>
</tr>
<tr>
    <td>app.&#8203;generic.&#8203;config.&#8203;app_deactivated</td>
    <td>App deactivated</td>
</tr>
<tr>
    <td>app.&#8203;generic.&#8203;config.&#8203;app_deleted</td>
    <td>App deleted</td>
</tr>
<tr>
    <td>app.&#8203;generic.&#8203;config.&#8203;app_updated</td>
    <td>App configuration updated ${custom_message}</td>
</tr>
<tr>
    <td>app.&#8203;generic.&#8203;import.&#8203;provisioning_data</td>
    <td>Imported provisioning data for app</td>
</tr>
<tr>
    <td>app.&#8203;generic.&#8203;import.&#8203;import_user</td>
    <td>Started importing users for app</td>
</tr>
<tr>
    <td>app.&#8203;generic.&#8203;import.&#8203;summary.&#8203;custom_object</td>
    <td>Imported Custom Objects: ${objects_total} scanned, ${objects_added} added, ${objects_updated} updated, ${objects_deleted} deleted</td>
</tr>
<tr>
    <td>app.&#8203;generic.&#8203;import.&#8203;details.&#8203;add_custom_object</td>
    <td>Import added new Custom Object of type ${custom_object_type} with id ${custom_object_id}</td>
</tr>
<tr>
    <td>app.&#8203;generic.&#8203;import.&#8203;details.&#8203;update_custom_object</td>
    <td>Import updated existing Custom Object of type ${custom_object_type} with id ${custom_object_id}</td>
</tr>
<tr>
    <td>app.&#8203;generic.&#8203;import.&#8203;details.&#8203;delete_custom_object</td>
    <td>Import removed existing Custom Object of type ${custom_object_type} with id ${custom_object_id}</td>
</tr>
<tr>
    <td>app.&#8203;generic.&#8203;import.&#8203;summary.&#8203;user</td>
    <td>Imported Users: ${objects_total} scanned, ${objects_unchanged} unchanged, ${objects_added} added, ${objects_updated} updated, ${objects_deleted} deleted</td>
</tr>
<tr>
    <td>app.&#8203;generic.&#8203;import.&#8203;details.&#8203;add_user</td>
    <td>Import added new User: ${app_username}</td>
</tr>
<tr>
    <td>app.&#8203;generic.&#8203;import.&#8203;details.&#8203;update_user</td>
    <td>Import updated existing User: ${app_username}</td>
</tr>
<tr>
    <td>app.&#8203;generic.&#8203;import.&#8203;details.&#8203;delete_user</td>
    <td>Import removed existing User: ${app_username}</td>
</tr>
<tr>
    <td>app.&#8203;generic.&#8203;import.&#8203;summary.&#8203;group</td>
    <td>Imported Groups: ${objects_total} scanned, ${objects_unchanged} unchanged, ${objects_added} added, ${objects_updated} updated, ${objects_deleted} deleted</td>
</tr>
<tr>
    <td>app.&#8203;generic.&#8203;import.&#8203;details.&#8203;add_group</td>
    <td>Import added new Group: ${group_name} - ${group_description}</td>
</tr>
<tr>
    <td>app.&#8203;generic.&#8203;import.&#8203;details.&#8203;update_group</td>
    <td>Import updated existing Group: ${group_name} - ${group_description}</td>
</tr>
<tr>
    <td>app.&#8203;generic.&#8203;import.&#8203;details.&#8203;delete_group</td>
    <td>Import removed existing Group: ${group_name} - ${group_description}</td>
</tr>
<tr>
    <td>app.&#8203;generic.&#8203;import.&#8203;summary.&#8203;group_membership</td>
    <td>Imported Group Members: ${objects_total} scanned, ${objects_unchanged} unchanged, ${objects_added} added, ${objects_deleted} deleted</td>
</tr>
<tr>
    <td>app.&#8203;generic.&#8203;import.&#8203;new_user</td>
    <td>Import added new User: ${app_username}</td>
</tr>
<tr>
    <td>app.&#8203;generic.&#8203;import.&#8203;user_update</td>
    <td>Import updated existing User: ${app_username}</td>
</tr>
<tr>
    <td>app.&#8203;generic.&#8203;import.&#8203;user_delete</td>
    <td>Import removed existing User: ${app_username}</td>
</tr>
<tr>
    <td>app.&#8203;generic.&#8203;import.&#8203;user_match.&#8203;complete</td>
    <td>User matching complete</td>
</tr>
<tr>
    <td>app.&#8203;generic.&#8203;import.&#8203;started</td>
    <td>${import_type} Import started via ${import_trigger}</td>
</tr>
<tr>
    <td>app.&#8203;generic.&#8203;import.&#8203;complete</td>
    <td>Import complete, total time: ${import_time}</td>
</tr>
<tr>
    <td>app.&#8203;generic.&#8203;config.&#8203;app_username_update</td>
    <td>User has changed their app username to ${app_username}</td>
</tr>
<tr>
    <td>app.&#8203;generic.&#8203;config.&#8203;app_password_update</td>
    <td>User has changed their app password</td>
</tr>
<tr>
    <td>app.&#8203;generic.&#8203;config.&#8203;app_user_update</td>
    <td>App user property has been updated</td>
</tr>
<tr>
    <td>app.&#8203;generic.&#8203;reversibility.&#8203;credentials.&#8203;recovery</td>
    <td>Password recovered from previous assignment</td>
</tr>
<tr>
    <td>app.&#8203;generic.&#8203;reversibility.&#8203;personal.&#8203;app.&#8203;recovery</td>
    <td>Personal app assignment recovered</td>
</tr>
<tr>
    <td>app.&#8203;generic.&#8203;reversibility.&#8203;individual.&#8203;app.&#8203;recovery</td>
    <td>Individual app assignment recovered</td>
</tr>
</tbody></table>

#### App Group

<table style="table-layout-fixed table-layout-fixed-events">
    
    <col width="377px" />
    <col width="309px" />
    <thead>
        <tr>
            <th>ObjectType</th>
            <th>Description</th>
        </tr>
    </thead>
<tbody>
<tr>
    <td>app.&#8203;user_management.&#8203;grouppush.&#8203;mapping.&#8203;created.&#8203;from.&#8203;rule</td>
    <td>A Group Push mapping to the group ${user_group_name} has been created from the rule ${rule_id} with the id - ${msg}.</td>
</tr>
<tr>
    <td>app.&#8203;user_management.&#8203;grouppush.&#8203;mapping.&#8203;created.&#8203;from.&#8203;rule.&#8203;error.&#8203;duplicate</td>
    <td>A Group Push mapping to the group ${user_group_name} did not get created from rule ${rule_id} because an existing mapping already existed.</td>
</tr>
<tr>
    <td>app.&#8203;user_management.&#8203;grouppush.&#8203;mapping.&#8203;created.&#8203;from.&#8203;rule.&#8203;warning.&#8203;duplicate.&#8203;name</td>
    <td>A Group Push mapping did not get created from rule ${rule_id} to UserGroup ${user_group_name} since group with same name already exists in AppInstance ${app_instance_id}</td>
</tr>
<tr>
    <td>app.&#8203;user_management.&#8203;grouppush.&#8203;mapping.&#8203;created.&#8203;from.&#8203;rule.&#8203;warning.&#8203;duplicate.&#8203;name.&#8203;tobecreated</td>
    <td>A Group Push mapping did not get created from rule ${rule_id} to UserGroup ${user_group_name} since group with same name will already be created in AppInstance ${app_instance_id}</td>
</tr>
<tr>
    <td>app.&#8203;user_management.&#8203;grouppush.&#8203;mapping.&#8203;created.&#8203;from.&#8203;rule.&#8203;warning.&#8203;upsertGroup.&#8203;duplicate.&#8203;name</td>
    <td>UserGroup was created or updated. A Group Push mapping did not get created from rule ${rule_id} to UserGroup ${user_group_name} since group with same name already exists in AppInstance ${app_instance_id}</td>
</tr>
<tr>
    <td>app.&#8203;user_management.&#8203;grouppush.&#8203;mapping.&#8203;created.&#8203;from.&#8203;rule.&#8203;error.&#8203;validation</td>
    <td>A Group Push mapping to the group ${user_group_name} did not get created from rule ${rule_id} because of the validation error: ${msg}</td>
</tr>
<tr>
    <td>app.&#8203;user_management.&#8203;grouppush.&#8203;mapping.&#8203;created.&#8203;from.&#8203;rule.&#8203;errors</td>
    <td>A Group Push mapping to the group ${user_group_name} did not get created from rule ${rule_id} because of errors: ${msg}</td>
</tr>
<tr>
    <td>app.&#8203;user_management.&#8203;grouppush.&#8203;mapping.&#8203;deactivated.&#8203;source.&#8203;group.&#8203;renamed</td>
    <td>A Group push mapping to the group ${user_group_name} was deactivated because the source group was renamed.</td>
</tr>
<tr>
    <td>app.&#8203;user_management.&#8203;grouppush.&#8203;mapping.&#8203;deactivated.&#8203;source.&#8203;group.&#8203;renamed.&#8203;failed</td>
    <td>A Group push mapping to the group ${user_group_name} could not be deactivated when the source group was renamed.</td>
</tr>
<tr>
    <td>app.&#8203;user_management.&#8203;grouppush.&#8203;mapping.&#8203;app.&#8203;group.&#8203;renamed</td>
    <td>A Group push mapping to the group ${user_group_name} was renamed because the source group was renamed.</td>
</tr>
<tr>
    <td>app.&#8203;user_management.&#8203;grouppush.&#8203;mapping.&#8203;app.&#8203;group.&#8203;renamed.&#8203;failed</td>
    <td>A Group push mapping to the group ${user_group_name} could not be renamed when the source group was renamed.</td>
</tr>
<tr>
    <td>app.&#8203;user_management.&#8203;grouppush.&#8203;mapping.&#8203;and.&#8203;groups.&#8203;deleted.&#8203;rule.&#8203;deleted</td>
    <td>The Group push mapping to the group ${user_group_name} will be deleted because its rule has been deleted.</td>
</tr>
<tr>
    <td>app.&#8203;user_management.&#8203;grouppush.&#8203;mapping.&#8203;update.&#8203;or.&#8203;delete.&#8203;failed.&#8203;with.&#8203;error</td>
    <td>Changes to the Group push mapping for the group ${user_group_name} could not take effect due to error: ${msg}</td>
</tr>
<tr>
    <td>app.&#8203;user_management.&#8203;grouppush.&#8203;mapping.&#8203;update.&#8203;or.&#8203;delete.&#8203;failed</td>
    <td>Changes to the Group push mapping for the group ${user_group_name} could not take effect.</td>
</tr>
<tr>
    <td>app.&#8203;user_management.&#8203;grouppush.&#8203;mapping.&#8203;okta.&#8203;users.&#8203;ignored</td>
    <td>${ignored_okta_users} Okta users ignored while pushing group ${user_group_name} to AppInstance ${app_instance_id}</td>
</tr>
<tr>
    <td>app.&#8203;user_management.&#8203;grouppush.&#8203;mapping.&#8203;created</td>
    <td>A Group Push mapping to the group ${user_group_name} has been created.</td>
</tr>
<tr>
    <td>platform.&#8203;grouppush.&#8203;appgroup.&#8203;not.&#8203;found</td>
    <td>No appGroup found for the user group id: {0}</td>
</tr>
<tr>
    <td>platform.&#8203;grouppush.&#8203;appgroup.&#8203;oktamastered</td>
    <td>Appgroup {0} is already Okta mastered</td>
</tr>
<tr>
    <td>platform.&#8203;group_app_assignment.&#8203;app_add</td>
    <td>App ${instance_name} added to group ${group_name}</td>
</tr>
<tr>
    <td>platform.&#8203;group_app_assignment.&#8203;app_remove</td>
    <td>App ${instance_name} removed from group ${group_name}</td>
</tr>
<tr>
    <td>platform.&#8203;group_app_assignment.&#8203;app_edit</td>
    <td>App ${instance_name} properties edited in group ${group_name}</td>
</tr>
<tr>
    <td>platform.&#8203;agents_upgrade.&#8203;missing_packagetype</td>
    <td>Missing package type for Agent version {0}</td>
</tr>
</tbody></table>

#### Real time sync

<table style="table-layout-fixed table-layout-fixed-events">
    
    <col width="377px" />
    <col width="309px" />
    <thead>
        <tr>
            <th>ObjectType</th>
            <th>Description</th>
        </tr>
    </thead>
<tbody>
<tr>
    <td>app.&#8203;realtimesync.&#8203;import.&#8203;details.&#8203;add_user</td>
    <td>Real time sync added new User: ${app_username}</td>
</tr>
<tr>
    <td>app.&#8203;realtimesync.&#8203;import.&#8203;details.&#8203;update_user</td>
    <td>Real time sync updated existing User: ${app_username}</td>
</tr>
<tr>
    <td>app.&#8203;realtimesync.&#8203;import.&#8203;details.&#8203;delete_user</td>
    <td>Real time sync removed existing User: ${app_username}</td>
</tr>
<tr>
    <td>app.&#8203;realtimesync.&#8203;import_failed.&#8203;details.&#8203;email_length</td>
    <td>Real time sync failed due to email address too long: ${app_error_code}</td>
</tr>
</tbody></table>

#### App Instance

<table style="table-layout-fixed table-layout-fixed-events">
    
    <col width="377px" />
    <col width="309px" />
    <thead>
        <tr>
            <th>ObjectType</th>
            <th>Description</th>
        </tr>
    </thead>
<tbody>
<tr>
    <td>app.&#8203;app_instance.&#8203;change</td>
    <td>App settings changed</td>
</tr>
<tr>
    <td>app.&#8203;app_instance.&#8203;logo_update</td>
    <td>Logo changed</td>
</tr>
<tr>
    <td>app.&#8203;app_instance.&#8203;logo_reset</td>
    <td>Logo reset</td>
</tr>
<tr>
    <td>app.&#8203;app_instance.&#8203;label_update</td>
    <td>Label changed</td>
</tr>
<tr>
    <td>app.&#8203;app_instance.&#8203;seats_update</td>
    <td>Number of seats changed</td>
</tr>
<tr>
    <td>app.&#8203;app_instance.&#8203;icon_hidden</td>
    <td>Do not display icon to users</td>
</tr>
<tr>
    <td>app.&#8203;app_instance.&#8203;icon_displayed</td>
    <td>Display icon to users</td>
</tr>
<tr>
    <td>app.&#8203;app_instance.&#8203;icon_hidden_in_ios</td>
    <td>Do not display icon in the Okta Mobile app</td>
</tr>
<tr>
    <td>app.&#8203;app_instance.&#8203;icon_displayed_in_ios</td>
    <td>Display icon in the Okta Mobile app</td>
</tr>
<tr>
    <td>app.&#8203;app_instance.&#8203;toolbar_autosubmit_enabled</td>
    <td>Toolbar autosubmit is enabled</td>
</tr>
<tr>
    <td>app.&#8203;app_instance.&#8203;toolbar_autosubmit_disabled</td>
    <td>Toolbar autosubmit is disabled</td>
</tr>
<tr>
    <td>app.&#8203;app_instance.&#8203;outbound_delauth_enabled</td>
    <td>Delegated authentication is enabled</td>
</tr>
<tr>
    <td>app.&#8203;app_instance.&#8203;outbound_delauth_disabled</td>
    <td>Delegated authentication is disabled</td>
</tr>
<tr>
    <td>app.&#8203;app_instance.&#8203;sign_on_policy.&#8203;change</td>
    <td>Sign on policy changed</td>
</tr>
<tr>
    <td>app.&#8203;app_instance.&#8203;sign_on_policy.&#8203;new_rule</td>
    <td>Rule created in sign on policy</td>
</tr>
<tr>
    <td>app.&#8203;app_instance.&#8203;sign_on_policy.&#8203;delete_rule</td>
    <td>Rule deleted in sign on policy</td>
</tr>
<tr>
    <td>app.&#8203;app_instance.&#8203;sign_on_policy.&#8203;access_denied</td>
    <td>User denied access due to sign on policy</td>
</tr>
<tr>
    <td>app.&#8203;app_instance.&#8203;import_schedule_update</td>
    <td>Import scheduled changed</td>
</tr>
<tr>
    <td>app.&#8203;app_instance.&#8203;autoconfirm_imports_enabled</td>
    <td>Imported new users will be automatically confirmed</td>
</tr>
<tr>
    <td>app.&#8203;app_instance.&#8203;autoconfirm_imports_disabled</td>
    <td>Imported users will not be automatically confirmed</td>
</tr>
<tr>
    <td>app.&#8203;app_instance.&#8203;autoconfirm_both_imports_enabled</td>
    <td>Imported new and existing users will be automatically confirmed</td>
</tr>
<tr>
    <td>app.&#8203;app_instance.&#8203;autoactivate_imports_enabled</td>
    <td>Imported users will be automatically activated</td>
</tr>
<tr>
    <td>app.&#8203;app_instance.&#8203;autoactivate_imports_disabled</td>
    <td>Imported users will not be automatically activated</td>
</tr>
<tr>
    <td>app.&#8203;app_instance.&#8203;error_page_update</td>
    <td>Using custom error page</td>
</tr>
<tr>
    <td>app.&#8203;app_instance.&#8203;error_page_reset</td>
    <td>Using default error page</td>
</tr>
<tr>
    <td>app.&#8203;app_instance.&#8203;display_links_update</td>
    <td>Number of links displayed changed</td>
</tr>
<tr>
    <td>app.&#8203;app_instance.&#8203;import_ou_update</td>
    <td>Organizational Unit to import changed</td>
</tr>
<tr>
    <td>app.&#8203;app_instance.&#8203;suppress_activation_mail_enabled</td>
    <td>Stop sending new user activation emails</td>
</tr>
<tr>
    <td>app.&#8203;app_instance.&#8203;suppress_activation_mail_disabled</td>
    <td>Sending new user activation emails</td>
</tr>
<tr>
    <td>app.&#8203;app_instance.&#8203;activation_email_recipient_update</td>
    <td>Recipient of new account credentials changed</td>
</tr>
<tr>
    <td>app.&#8203;app_instance.&#8203;sign_on_method_update</td>
    <td>Sign on method changed</td>
</tr>
<tr>
    <td>app.&#8203;app_instance.&#8203;default_username_update</td>
    <td>Application username format changed: {0} -> {1}</td>
</tr>
<tr>
    <td>app.&#8203;app_instance.&#8203;auth_token_update</td>
    <td>Authentication token generated</td>
</tr>
<tr>
    <td>app.&#8203;app_instance.&#8203;profile_master_enabled</td>
    <td>Profile mastering enabled</td>
</tr>
<tr>
    <td>app.&#8203;app_instance.&#8203;profile_master_disabled</td>
    <td>Profile mastering disabled</td>
</tr>
<tr>
    <td>app.&#8203;app_instance.&#8203;push_new_users_enabled</td>
    <td>Pushing new users</td>
</tr>
<tr>
    <td>app.&#8203;app_instance.&#8203;push_new_users_disabled</td>
    <td>Importing new users</td>
</tr>
<tr>
    <td>app.&#8203;app_instance.&#8203;push_profile_updates_enabled</td>
    <td>Pushing user profile changes</td>
</tr>
<tr>
    <td>app.&#8203;app_instance.&#8203;push_profile_updates_disabled</td>
    <td>Importing user profile changes</td>
</tr>
<tr>
    <td>app.&#8203;app_instance.&#8203;push_password_updates_enabled</td>
    <td>Pushing user passwords</td>
</tr>
<tr>
    <td>app.&#8203;app_instance.&#8203;push_password_updates_disabled</td>
    <td>Stop pushing user passwords</td>
</tr>
<tr>
    <td>app.&#8203;app_instance.&#8203;push_deactivated_users_enabled</td>
    <td>Deprovisioning unassigned users</td>
</tr>
<tr>
    <td>app.&#8203;app_instance.&#8203;push_deactivated_users_disabled</td>
    <td>Stop deprovisioning unassigned users</td>
</tr>
<tr>
    <td>app.&#8203;app_instance.&#8203;user_management_disabled</td>
    <td>Disable provisioning</td>
</tr>
<tr>
    <td>app.&#8203;app_instance.&#8203;default</td>
    <td>{0}</td>
</tr>
<tr>
    <td>app.&#8203;app_instance.&#8203;config-error</td>
    <td>Configuration error detected for ${app_instance_name}: ${config_error}</td>
</tr>
<tr>
    <td>app.&#8203;app_instance.&#8203;custom_user_management_support_enabled</td>
    <td>Custom Provisioning Support is enabled</td>
</tr>
<tr>
    <td>app.&#8203;app_instance.&#8203;custom_user_management_support_disabled</td>
    <td>Custom Provisioning Support is disabled</td>
</tr>
<tr>
    <td>app.&#8203;app_instance.&#8203;personal</td>
    <td>Personal App</td>
</tr>
<tr>
    <td>app.&#8203;app_instance.&#8203;import_match_rule_update</td>
    <td>Updated Import Match Rules</td>
</tr>
</tbody></table>

#### App Editor

<table style="table-layout-fixed table-layout-fixed-events">
    
    <col width="377px" />
    <col width="309px" />
    <thead>
        <tr>
            <th>ObjectType</th>
            <th>Description</th>
        </tr>
    </thead>
<tbody>
<tr>
    <td>app.&#8203;app_editor.&#8203;app.&#8203;create</td>
    <td>User created new app (Version ${app_version_id})</td>
</tr>
<tr>
    <td>app.&#8203;app_editor.&#8203;app.&#8203;update</td>
    <td>User updated app (Version ${app_version_id})</td>
</tr>
</tbody></table>

#### Auth

<table style="table-layout-fixed table-layout-fixed-events">
    
    <col width="377px" />
    <col width="309px" />
    <thead>
        <tr>
            <th>ObjectType</th>
            <th>Description</th>
        </tr>
    </thead>
<tbody>
<tr>
    <td>app.&#8203;auth.&#8203;sso</td>
    <td>User performed single sign on to app</td>
</tr>
</tbody></table>

#### Admin

<table style="table-layout-fixed table-layout-fixed-events">
    
    <col width="377px" />
    <col width="309px" />
    <thead>
        <tr>
            <th>ObjectType</th>
            <th>Description</th>
        </tr>
    </thead>
<tbody>
<tr>
    <td>app.&#8203;admin.&#8203;sso.&#8203;no_response</td>
    <td>SAML Response contained no confirmations</td>
</tr>
<tr>
    <td>app.&#8203;admin.&#8203;sso.&#8203;bad_response</td>
    <td>Could not parse SAML response</td>
</tr>
<tr>
    <td>app.&#8203;admin.&#8203;sso.&#8203;orgapp.&#8203;notfound</td>
    <td>Could not find application instance</td>
</tr>
</tbody></table>

#### Inbound Del Auth

<table style="table-layout-fixed table-layout-fixed-events">
    
    <col width="377px" />
    <col width="309px" />
    <thead>
        <tr>
            <th>ObjectType</th>
            <th>Description</th>
        </tr>
    </thead>
<tbody>
<tr>
    <td>app.&#8203;inbound_del_auth.&#8203;login_success</td>
    <td>Successful inbound delegated authentication request for user ${username}</td>
</tr>
<tr>
    <td>app.&#8203;inbound_del_auth.&#8203;failure.&#8203;not_supported</td>
    <td>App does not support delegated authentication</td>
</tr>
<tr>
    <td>app.&#8203;inbound_del_auth.&#8203;failure.&#8203;instance_not_found</td>
    <td>External system attempted to delegate authentication to Okta with an unknown app instance id: ${instance_id}</td>
</tr>
<tr>
    <td>app.&#8203;inbound_del_auth.&#8203;failure.&#8203;invalid_request.&#8203;could_not_parse_credentials</td>
    <td>Could not parse credentials from incoming request</td>
</tr>
<tr>
    <td>app.&#8203;inbound_del_auth.&#8203;failure.&#8203;account_not_found</td>
    <td>Could not find user matching username ${username} during delegated authentication from app: ${app_name}</td>
</tr>
<tr>
    <td>app.&#8203;inbound_del_auth.&#8203;failure.&#8203;invalid_login_credentials</td>
    <td>Got invalid credentials for username: ${username} trying to sign-in to app: ${app_name}. Login result code: ${login_result}</td>
</tr>
</tbody></table>

#### Rich client auth

<table style="table-layout-fixed table-layout-fixed-events">
    
    <col width="377px" />
    <col width="309px" />
    <thead>
        <tr>
            <th>ObjectType</th>
            <th>Description</th>
        </tr>
    </thead>
<tbody>
<tr>
    <td>app.&#8203;rich_client.&#8203;instance_not_found</td>
    <td>Rich client authentication failed: Unknown app instance id ${instance_id}</td>
</tr>
<tr>
    <td>app.&#8203;rich_client.&#8203;account_not_found</td>
    <td>Rich client authentication failed: Could not find ${app_name} user matching username ${username}</td>
</tr>
<tr>
    <td>app.&#8203;rich_client.&#8203;multiple_accounts_found</td>
    <td>Rich client authentication failed: Multiple ${app_name} users with username ${username} found</td>
</tr>
<tr>
    <td>app.&#8203;rich_client.&#8203;login_failure</td>
    <td>Rich client authentication failed for user ${username} to app ${app_name}</td>
</tr>
<tr>
    <td>app.&#8203;rich_client.&#8203;login_success</td>
    <td>Successful rich client authentication for user ${username} to app ${app_name}</td>
</tr>
</tbody></table>

#### RUM

<table style="table-layout-fixed table-layout-fixed-events">
    
    <col width="377px" />
    <col width="309px" />
    <thead>
        <tr>
            <th>ObjectType</th>
            <th>Description</th>
        </tr>
    </thead>
<tbody>
<tr>
    <td>app.&#8203;rum.&#8203;validation.&#8203;error</td>
    <td>Error during package validation: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;rum.&#8203;validation.&#8203;failure</td>
    <td>Remote User Management package validation failed: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;rum.&#8203;config.&#8203;validation.&#8203;error</td>
    <td>Error validating instance configuration: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;rum.&#8203;failure.&#8203;partial.&#8203;results.&#8203;invalid.&#8203;field.&#8203;type</td>
    <td>Remote User Management call to {0} failed. Expected the field {1} to be an integer but it was not.</td>
</tr>
</tbody></table>

#### Google

<table style="table-layout-fixed table-layout-fixed-events">
    
    <col width="377px" />
    <col width="309px" />
    <thead>
        <tr>
            <th>ObjectType</th>
            <th>Description</th>
        </tr>
    </thead>
<tbody>
<tr>
    <td>app.&#8203;google.&#8203;sso.&#8203;failure.&#8203;relay_state_not_found</td>
    <td>SSO Error: No RelayState passed in request</td>
</tr>
<tr>
    <td>app.&#8203;google.&#8203;sso.&#8203;failure.&#8203;domain_not_found</td>
    <td>SSO Error: Unable to determine Google domain from URI [${invalid_uri}]</td>
</tr>
<tr>
    <td>app.&#8203;google.&#8203;sso.&#8203;failure.&#8203;invalid_continue_url</td>
    <td>SSO Error: Could not parse domain from URI [${invalid_url}]</td>
</tr>
<tr>
    <td>app.&#8203;google.&#8203;sso.&#8203;failure.&#8203;invalid_domain</td>
    <td>SSO Error: Google domain [${invalid_domain}] is not valid</td>
</tr>
<tr>
    <td>app.&#8203;google.&#8203;user_management.&#8203;failure.&#8203;api_login_failure</td>
    <td>API login failed.</td>
</tr>
<tr>
    <td>app.&#8203;google.&#8203;user_management.&#8203;failure.&#8203;api_service_forbidden</td>
    <td>API service forbidden: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;google.&#8203;user_management.&#8203;failure.&#8203;provisioning</td>
    <td>Failed to provision app user: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;google.&#8203;user_management.&#8203;failure.&#8203;user_import</td>
    <td>Failed to import Google user: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;google.&#8203;user_management.&#8203;failure.&#8203;user_group_import</td>
    <td>Failed to import groups for Google user: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;google.&#8203;user_management.&#8203;failure.&#8203;download.&#8203;custom.&#8203;objects</td>
    <td>Failed to download group data: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;google.&#8203;user_management.&#8203;failure.&#8203;create.&#8203;group</td>
    <td>Failed to create Google group: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;google.&#8203;user_management.&#8203;failure.&#8203;delete.&#8203;group</td>
    <td>Failed to delete Google group: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;google.&#8203;user_management.&#8203;failure.&#8203;update.&#8203;group</td>
    <td>Failed to update Google group data: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;google.&#8203;user_management.&#8203;failure.&#8203;group.&#8203;membership.&#8203;update</td>
    <td>Could not update Google group membership: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;google.&#8203;user_management.&#8203;add_user_to_group</td>
    <td>Added ${okta_username} to group '${group}'</td>
</tr>
<tr>
    <td>app.&#8203;google.&#8203;user_management.&#8203;remove_user_from_group</td>
    <td>Removed ${okta_username} from group '${group}'</td>
</tr>
<tr>
    <td>app.&#8203;google.&#8203;user_management.&#8203;error.&#8203;check_user_exists</td>
    <td>Failed to verify that the user exists. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;google.&#8203;user_management.&#8203;error.&#8203;check_user_exists.&#8203;invalid_domain</td>
    <td>The user's email domain does not match the domain specified in Google Apps</td>
</tr>
<tr>
    <td>app.&#8203;google.&#8203;user_management.&#8203;error.&#8203;create_new_user</td>
    <td>Failed to create new user. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;google.&#8203;user_management.&#8203;error.&#8203;deactivate_user</td>
    <td>Failed to deactivate user. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;google.&#8203;user_management.&#8203;error.&#8203;reactivate_user</td>
    <td>Failed to reactivate user. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;google.&#8203;user_management.&#8203;error.&#8203;push_password_update</td>
    <td>Failed to push password update. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;google.&#8203;user_management.&#8203;error.&#8203;push_profile_update</td>
    <td>Failed to push profile update. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;google.&#8203;user_management.&#8203;error.&#8203;download_users</td>
    <td>Failed to download users. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;google.&#8203;user_management.&#8203;error.&#8203;import_user_profile</td>
    <td>Failed to import user profile. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;google.&#8203;user_management.&#8203;error.&#8203;download_custom_objects</td>
    <td>Failed to download custom objects. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;google.&#8203;user_management.&#8203;error.&#8203;create_group</td>
    <td>Failed to create group. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;google.&#8203;user_management.&#8203;error.&#8203;create_group_duplicate</td>
    <td>Failed to create group because group already exists. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;google.&#8203;user_management.&#8203;error.&#8203;update_group</td>
    <td>Failed to update group. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;google.&#8203;user_management.&#8203;error.&#8203;delete_group</td>
    <td>Failed to delete group. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;google.&#8203;user_management.&#8203;error.&#8203;download_group_members</td>
    <td>Failed to retrieve members from group. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;google.&#8203;user_management.&#8203;error.&#8203;add_member_to_group</td>
    <td>Failed to add user to group. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;google.&#8203;user_management.&#8203;error.&#8203;remove_member_from_group</td>
    <td>Failed to remove user to group. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;google.&#8203;user_management.&#8203;error.&#8203;download_org_units</td>
    <td>Failed to download organization units. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;google.&#8203;user_management.&#8203;error.&#8203;rateLimit</td>
    <td>Rate limit exceeded for Google. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;google.&#8203;user_management.&#8203;error.&#8203;download_app_schema</td>
    <td>Failed to download Google schema. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;google.&#8203;user_management.&#8203;error.&#8203;invalid_orgunit_id</td>
    <td>The OrgUnit specified is invalid. Please refresh the Application Data and retry again. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;google.&#8203;api.&#8203;error.&#8203;DomainUserLimitExceeded</td>
    <td>Maximum number of users permitted has been reached for this domain</td>
</tr>
<tr>
    <td>app.&#8203;google.&#8203;api.&#8203;error.&#8203;InvalidEmailAddress</td>
    <td>Invalid Email Address</td>
</tr>
<tr>
    <td>app.&#8203;google.&#8203;api.&#8203;error.&#8203;InvalidFamilyName</td>
    <td>Invald Family Name</td>
</tr>
<tr>
    <td>app.&#8203;google.&#8203;api.&#8203;error.&#8203;InvalidGivenName</td>
    <td>Invalid Given Name</td>
</tr>
<tr>
    <td>app.&#8203;google.&#8203;api.&#8203;error.&#8203;UnknownError</td>
    <td>Unknown error occurred while provisioning user</td>
</tr>
<tr>
    <td>app.&#8203;google.&#8203;api.&#8203;error.&#8203;ServerBusy</td>
    <td>Google Service is busy</td>
</tr>
<tr>
    <td>app.&#8203;google.&#8203;api.&#8203;error.&#8203;InvalidValue</td>
    <td>Invalid value while provisioning user</td>
</tr>
<tr>
    <td>app.&#8203;google.&#8203;api.&#8203;error.&#8203;InvalidPassword</td>
    <td>Password does not meet password policy</td>
</tr>
<tr>
    <td>app.&#8203;google.&#8203;api.&#8203;error.&#8203;EntityExists</td>
    <td>User already exists</td>
</tr>
<tr>
    <td>app.&#8203;google.&#8203;api.&#8203;error.&#8203;InvalidUsername</td>
    <td>Invalid User name</td>
</tr>
<tr>
    <td>app.&#8203;google.&#8203;api.&#8203;error.&#8203;UserDeletedRecently</td>
    <td>An account with this user name was recently deleted</td>
</tr>
<tr>
    <td>app.&#8203;google.&#8203;api.&#8203;error.&#8203;default</td>
    <td>{0}</td>
</tr>
</tbody></table>

#### Salesforce

<table style="table-layout-fixed table-layout-fixed-events">
    
    <col width="377px" />
    <col width="309px" />
    <thead>
        <tr>
            <th>ObjectType</th>
            <th>Description</th>
        </tr>
    </thead>
<tbody>
<tr>
    <td>app.&#8203;salesforce.&#8203;user_management.&#8203;failure.&#8203;invalid_api_credentials</td>
    <td>API login failed because credentials were invalid</td>
</tr>
<tr>
    <td>app.&#8203;salesforce.&#8203;user_management.&#8203;failure.&#8203;password_expired</td>
    <td>API login failed because password has expired</td>
</tr>
<tr>
    <td>app.&#8203;salesforce.&#8203;user_management.&#8203;failure.&#8203;api_service_not_available</td>
    <td>API login failed because this application's service appears to be unavailable.</td>
</tr>
<tr>
    <td>app.&#8203;salesforce.&#8203;user_management.&#8203;failure.&#8203;general_api_login_failure</td>
    <td>API login failed for an unknown reason.</td>
</tr>
<tr>
    <td>app.&#8203;salesforce.&#8203;user_management.&#8203;failure.&#8203;provisioning</td>
    <td>Failed to provision user due to: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;salesforce.&#8203;user_management.&#8203;failure.&#8203;user_import</td>
    <td>Failed import user in app due to: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;salesforce.&#8203;user_management.&#8203;failure.&#8203;no_api_response</td>
    <td>The Salesforce API is not responding. Please ensure that your configurations are correct.</td>
</tr>
<tr>
    <td>app.&#8203;salesforce.&#8203;user_management.&#8203;failure.&#8203;thirdparty_error</td>
    <td>External API error: ${app_error_message}</td>
</tr>
<tr>
    <td>app.&#8203;salesforce.&#8203;user_management.&#8203;failure.&#8203;cant.&#8203;push.&#8203;password</td>
    <td>Unable to push password to Salesforce: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;salesforce.&#8203;user_management.&#8203;sso.&#8203;only.&#8203;user.&#8203;password.&#8203;rejected</td>
    <td>Unable to push a password for an SSO-Only user in Salesforce</td>
</tr>
<tr>
    <td>app.&#8203;salesforce.&#8203;user_management.&#8203;failure.&#8203;add_user_to_public_group</td>
    <td>Failed to add user to public group: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;salesforce.&#8203;user_management.&#8203;failure.&#8203;remove_user_from_public_group</td>
    <td>Failed to remove user from public group: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;salesforce.&#8203;api.&#8203;error.&#8203;INVALID_OPERATION_WITH_EXPIRED_PASSWORD</td>
    <td>The password used to connect to the Salesforce API has expired</td>
</tr>
<tr>
    <td>app.&#8203;salesforce.&#8203;api.&#8203;error.&#8203;INVALID_LOGIN</td>
    <td>The credentials used to log in to the Salesforce API were invalid; please check your Salesforce configuration</td>
</tr>
<tr>
    <td>app.&#8203;salesforce.&#8203;api.&#8203;error.&#8203;INVALID_NEW_PASSWORD</td>
    <td>The password being set does not meet the password requirements of your Salesforce configuration.</td>
</tr>
<tr>
    <td>app.&#8203;salesforce.&#8203;api.&#8203;error.&#8203;default</td>
    <td>{0}</td>
</tr>
</tbody></table>

#### GoToMeeting

<table style="table-layout-fixed table-layout-fixed-events">
    
    <col width="377px" />
    <col width="309px" />
    <thead>
        <tr>
            <th>ObjectType</th>
            <th>Description</th>
        </tr>
    </thead>
<tbody>
<tr>
    <td>app.&#8203;gotomeeting.&#8203;user_management.&#8203;config.&#8203;failure.&#8203;api_login_failure</td>
    <td>Sign-in to app failed because the API credentials were invalid. Message from API: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;gotomeeting.&#8203;user_management.&#8203;config.&#8203;failure.&#8203;api_not_available</td>
    <td>Couldn't connect to the GoToMeeting API service for app: ${app_name}.</td>
</tr>
<tr>
    <td>app.&#8203;gotomeeting.&#8203;user_management.&#8203;config.&#8203;failure.&#8203;user_import</td>
    <td>Failed import user in app: ${app_name} due to: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;gotomeeting.&#8203;user_management.&#8203;config.&#8203;failure.&#8203;user_provisioning</td>
    <td>Failed to provision user in app: ${app_name} due to: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;gotomeeting.&#8203;user_management.&#8203;config.&#8203;failure.&#8203;api_url_is_malformed</td>
    <td>The URL used to connect the GoToMeeting API is malformed. Contact Okta if this persists.</td>
</tr>
<tr>
    <td>app.&#8203;gotomeeting.&#8203;api.&#8203;error.&#8203;DefaultMessage</td>
    <td>GoToMeeting API Error: [{0}] {1}</td>
</tr>
<tr>
    <td>app.gotomeeting.api.error.InvalidLogin</td>
    <td>This can occur for any of the following reasons: 1. The userid and/or password are invalid 2. The corporate account associated with the userid and password does not have the GoToMeeting API enabled 3. The userid/password is for a personal manager account.</td>
</tr>
<tr>
    <td>app.gotomeeting.api.error.SoftLockout</td>
    <td>Indicates that the account associated with the userid has been locked for 5 minutes due to 3 consecutive failed logon attempts</td>
</tr>
<tr>
    <td>app.gotomeeting.api.error.HardLockout</td>
    <td>Indicates that the account associated with the userid has been locked due to 10 consecutive failed logon attempts. Customer Care or Professional Services intervention is required to lift the hard lockout</td>
</tr>
<tr>
    <td>app.&#8203;gotomeeting.&#8203;api.&#8203;error.&#8203;InvalidEmailAddress</td>
    <td>Email Address has incorrect syntax/format.</td>
</tr>
<tr>
    <td>app.gotomeeting.api.error.EmailAlreadyInUseException</td>
    <td>Email Address is already in use by another organizer in the same account or is already invited to a different group.</td>
</tr>
<tr>
    <td>app.&#8203;gotomeeting.&#8203;api.&#8203;error.&#8203;NoSuchConnection</td>
    <td>The connection does not exist or has expired</td>
</tr>
<tr>
    <td>app.&#8203;gotomeeting.&#8203;api.&#8203;error.&#8203;RateLimitExceeded</td>
    <td>The rate limit for this call has been exceeded.</td>
</tr>
<tr>
    <td>app.gotomeeting.api.error.InternalError</td>
    <td>An unknown error occurred on the GoToMeeting Server. Please retry action. If this message persists please contact GoToMeeting support.</td>
</tr>
<tr>
    <td>app.&#8203;gotomeeting.&#8203;api.&#8203;error.&#8203;ServiceUnavailable</td>
    <td>The GoToMeeting API is currently unable to process requests.</td>
</tr>
<tr>
    <td>app.&#8203;gotomeeting.&#8203;api.&#8203;error.&#8203;NoSuchMember</td>
    <td>No organizer exists for the supplied organizerEmail.</td>
</tr>
<tr>
    <td>app.&#8203;gotomeeting_rest.&#8203;api.&#8203;error.&#8203;DefaultMessage</td>
    <td>GoToMeeting API Error: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;gotomeeting_rest.&#8203;user_management.&#8203;config.&#8203;failure.&#8203;api_not_available</td>
    <td>Couldn't connect to the GoToMeeting API service for app: ${app_name}.</td>
</tr>
<tr>
    <td>app.&#8203;gotomeeting_rest.&#8203;user_management.&#8203;config.&#8203;failure.&#8203;user_import</td>
    <td>Failed import user in app: ${app_name} due to: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;gotomeeting_rest.&#8203;user_management.&#8203;config.&#8203;failure.&#8203;user_provisioning</td>
    <td>Failed to provision user in app: ${app_name} due to: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;gotomeeting_rest.&#8203;user_management.&#8203;config.&#8203;failure.&#8203;api_url_is_malformed</td>
    <td>The URL used to connect the GoToMeeting API is malformed. Contact Okta if this persists.</td>
</tr>
<tr>
    <td>app.&#8203;gotomeeting_rest.&#8203;user_management.&#8203;config.&#8203;failure.&#8203;api_auth_failed</td>
    <td>OAuth authentication failed.</td>
</tr>
</tbody></table>

#### Workday

<table style="table-layout-fixed table-layout-fixed-events">
    
    <col width="377px" />
    <col width="309px" />
    <thead>
        <tr>
            <th>ObjectType</th>
            <th>Description</th>
        </tr>
    </thead>
<tbody>
<tr>
    <td>app.&#8203;workday.&#8203;api.&#8203;error.&#8203;validate</td>
    <td>Unable to validate Workday API Credentials: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;workday.&#8203;api.&#8203;error.&#8203;bind</td>
    <td>Unable to bind to Workday API Endpoint: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;workday.&#8203;api.&#8203;error.&#8203;get-workers</td>
    <td>Unable to fetch Workday users: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;workday.&#8203;api.&#8203;error.&#8203;get-worker-by-id</td>
    <td>Unable to find Workday user by id: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;workday.&#8203;api.&#8203;error.&#8203;get-worker-by-username</td>
    <td>Unable to find Workday user by username: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;workday.&#8203;api.&#8203;error.&#8203;parse-workers</td>
    <td>Unable to parse Worker result from Workday: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;workday.&#8203;api.&#8203;error.&#8203;parse-groups</td>
    <td>Unable to parse Group result from Workday: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;workday.&#8203;api.&#8203;error.&#8203;parse-group-assignments</td>
    <td>Unable to parse Group Assignment result from Workday: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;workday.&#8203;api.&#8203;error.&#8203;get-groups</td>
    <td>Unable to fetch provisioning groups from Workday: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;workday.&#8203;api.&#8203;error.&#8203;get-group-assignments</td>
    <td>Unable to fetch provisioning group assignments from Workday: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;workday.&#8203;api.&#8203;error.&#8203;get-tx-logs</td>
    <td>Unable to fetch Workday transaction logs: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;workday.&#8203;api.&#8203;error.&#8203;connect-custom-report</td>
    <td>Unable to establish connection to fetch custom report: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;workday.&#8203;api.&#8203;error.&#8203;get-custom-report-xsd-parsing</td>
    <td>Unable to parse the custom report: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;workday.&#8203;api.&#8203;error.&#8203;parse-custom-report</td>
    <td>Unable to parse the custom report: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;workday.&#8203;api.&#8203;error.&#8203;universal-directory-setup-error</td>
    <td>Unable to set up universal directory: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;workday.&#8203;api.&#8203;error.&#8203;custom-report-unknown-failure</td>
    <td>Unable to fetch custom report: ${app_error_code}</td>
</tr>
<tr>
    <td>workdayNoEmployeeIdPrompt</td>
    <td>No Employee Id Prompt for WID found in custom reports. ${app_error_code}</td>
</tr>
<tr>
    <td>workdayNullInResponse</td>
    <td>Null in response from Workday. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;workday.&#8203;api.&#8203;error.&#8203;default</td>
    <td>Workday API Error</td>
</tr>
<tr>
    <td>app.&#8203;workday.&#8203;api.&#8203;error.&#8203;search</td>
    <td>Unable to perform search</td>
</tr>
<tr>
    <td>app.&#8203;workday.&#8203;api.&#8203;error.&#8203;fetch</td>
    <td>Unable to retrieve user</td>
</tr>
<tr>
    <td>app.&#8203;workday.&#8203;api.&#8203;error.&#8203;update</td>
    <td>Unable to update user</td>
</tr>
<tr>
    <td>app.&#8203;workday.&#8203;api.&#8203;error.&#8203;builduser</td>
    <td>Unable to build user: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;yammer.&#8203;api.&#8203;error.&#8203;validation</td>
    <td>Unable to validate Yammer API configuration</td>
</tr>
<tr>
    <td>app.&#8203;yammer.&#8203;api.&#8203;error.&#8203;check.&#8203;user</td>
    <td>Unable to check for user on Yammer</td>
</tr>
<tr>
    <td>app.&#8203;yammer.&#8203;api.&#8203;error.&#8203;download.&#8203;users</td>
    <td>Unable to download users from Yammer</td>
</tr>
<tr>
    <td>app.&#8203;yammer.&#8203;api.&#8203;error.&#8203;import.&#8203;profile</td>
    <td>Unable to import user profile from Yammer</td>
</tr>
<tr>
    <td>app.&#8203;yammer.&#8203;api.&#8203;error.&#8203;push.&#8203;profile</td>
    <td>Unable to push user profile to Yammer</td>
</tr>
<tr>
    <td>app.&#8203;yammer.&#8203;api.&#8203;error.&#8203;deactivation</td>
    <td>Unable to deactivate user within Yammer</td>
</tr>
<tr>
    <td>app.&#8203;yammer.&#8203;api.&#8203;error.&#8203;create.&#8203;user</td>
    <td>Unable to create user within Yammer</td>
</tr>
<tr>
    <td>app.&#8203;yammer.&#8203;api.&#8203;error.&#8203;query</td>
    <td>Unable to query Yammer API</td>
</tr>
</tbody></table>

#### Echosign

<table style="table-layout-fixed table-layout-fixed-events">
    
    <col width="377px" />
    <col width="309px" />
    <thead>
        <tr>
            <th>ObjectType</th>
            <th>Description</th>
        </tr>
    </thead>
<tbody>
<tr>
    <td>app.&#8203;echosign.&#8203;api.&#8203;error.&#8203;connection</td>
    <td>Failed to connect with the Echosign API key</td>
</tr>
<tr>
    <td>app.&#8203;echosign.&#8203;api.&#8203;error.&#8203;search.&#8203;by.&#8203;id</td>
    <td>Error when searching Echosign for User</td>
</tr>
<tr>
    <td>app.&#8203;echosign.&#8203;api.&#8203;error.&#8203;search.&#8203;by.&#8203;login</td>
    <td>Error when searching Echosign for Username</td>
</tr>
<tr>
    <td>app.&#8203;echosign.&#8203;api.&#8203;error.&#8203;download.&#8203;users</td>
    <td>Error when fetching all users in Echosign</td>
</tr>
<tr>
    <td>app.&#8203;echosign.&#8203;api.&#8203;error.&#8203;import.&#8203;profile</td>
    <td>Error when importing profile information for user</td>
</tr>
<tr>
    <td>app.&#8203;echosign.&#8203;api.&#8203;error.&#8203;create</td>
    <td>Error trying to create new user in EchoSign</td>
</tr>
</tbody></table>

#### SuccessFactors

<table style="table-layout-fixed table-layout-fixed-events">
    
    <col width="377px" />
    <col width="309px" />
    <thead>
        <tr>
            <th>ObjectType</th>
            <th>Description</th>
        </tr>
    </thead>
<tbody>
<tr>
    <td>app.&#8203;successfactors.&#8203;api.&#8203;exception</td>
    <td>Failed to query SuccessFactors API</td>
</tr>
<tr>
    <td>app.&#8203;successfactors.&#8203;api.&#8203;error</td>
    <td>Error parsing SuccessFactors API results</td>
</tr>
</tbody></table>

#### Postini

<table style="table-layout-fixed table-layout-fixed-events">
    
    <col width="377px" />
    <col width="309px" />
    <thead>
        <tr>
            <th>ObjectType</th>
            <th>Description</th>
        </tr>
    </thead>
<tbody>
<tr>
    <td>app.&#8203;postini.&#8203;user_management.&#8203;config.&#8203;failure.&#8203;api_login_failed</td>
    <td>Failed to authenticate with the Postini API</td>
</tr>
<tr>
    <td>app.&#8203;postini.&#8203;user_management.&#8203;config.&#8203;failure.&#8203;api_not_available</td>
    <td>Could not connect to the Postini API</td>
</tr>
<tr>
    <td>app.&#8203;postini.&#8203;user_management.&#8203;config.&#8203;failure.&#8203;configuration</td>
    <td>Failed to set provisioning options for Postini</td>
</tr>
<tr>
    <td>app.&#8203;postini.&#8203;user_management.&#8203;config.&#8203;failure.&#8203;user_import</td>
    <td>Failed to import users from Postini</td>
</tr>
<tr>
    <td>app.&#8203;postini.&#8203;user_management.&#8203;config.&#8203;failure.&#8203;provisioning</td>
    <td>Failed to provision user in Postini</td>
</tr>
<tr>
    <td>app.&#8203;postini.&#8203;user_management.&#8203;failure.&#8203;download_users</td>
    <td>Failed to download users from Postini</td>
</tr>
</tbody></table>

#### Webex

<table style="table-layout-fixed table-layout-fixed-events">
    
    <col width="377px" />
    <col width="309px" />
    <thead>
        <tr>
            <th>ObjectType</th>
            <th>Description</th>
        </tr>
    </thead>
<tbody>
<tr>
    <td>app.&#8203;webex.&#8203;api.&#8203;error.&#8203;validation</td>
    <td>Failed to validate Webex Config: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;webex.&#8203;api.&#8203;error.&#8203;default</td>
    <td>Webex failure: ${app_error_code}</td>
</tr>
</tbody></table>

#### Zendesk

<table style="table-layout-fixed table-layout-fixed-events">
    
    <col width="377px" />
    <col width="309px" />
    <thead>
        <tr>
            <th>ObjectType</th>
            <th>Description</th>
        </tr>
    </thead>
<tbody>
<tr>
    <td>app.&#8203;zendesk.&#8203;api.&#8203;error.&#8203;validate</td>
    <td>Failed to validate Zendesk API credentials</td>
</tr>
<tr>
    <td>app.&#8203;zendesk.&#8203;api.&#8203;error.&#8203;download.&#8203;groups</td>
    <td>Failed to download group information from Zendes</td>
</tr>
<tr>
    <td>app.&#8203;zendesk.&#8203;api.&#8203;error.&#8203;parse.&#8203;groups</td>
    <td>Failed to parse group information from Zendesk</td>
</tr>
<tr>
    <td>app.&#8203;zendesk.&#8203;api.&#8203;error.&#8203;download.&#8203;organizations</td>
    <td>Failed to download organization information from Zendesk</td>
</tr>
<tr>
    <td>app.&#8203;zendesk.&#8203;api.&#8203;error.&#8203;get.&#8203;login</td>
    <td>Failed to get user by login</td>
</tr>
<tr>
    <td>app.&#8203;zendesk.&#8203;api.&#8203;error.&#8203;push.&#8203;password</td>
    <td>Failed to push password to Zendesk</td>
</tr>
<tr>
    <td>app.&#8203;zendesk.&#8203;api.&#8203;error.&#8203;push.&#8203;profile</td>
    <td>Failed to push user profile to Zendesk</td>
</tr>
<tr>
    <td>app.&#8203;zendesk.&#8203;api.&#8203;error.&#8203;create.&#8203;user</td>
    <td>Failed to create new user in Zendesk</td>
</tr>
<tr>
    <td>app.&#8203;zendesk.&#8203;api.&#8203;error.&#8203;get.&#8203;users</td>
    <td>Failed to download users from Zendesk</td>
</tr>
<tr>
    <td>app.&#8203;zendesk.&#8203;api.&#8203;error.&#8203;role.&#8203;restriction</td>
    <td>Invalid Role / Ticket Restriction combination for Zendesk user</td>
</tr>
</tbody></table>

#### Confluence

<table style="table-layout-fixed table-layout-fixed-events">
    
    <col width="377px" />
    <col width="309px" />
    <thead>
        <tr>
            <th>ObjectType</th>
            <th>Description</th>
        </tr>
    </thead>
<tbody>
<tr>
    <td>confluenceLoginFailed</td>
    <td>Could not connect to the Confluence API, please check your API Endpoint and Key</td>
</tr>
<tr>
    <td>app.&#8203;confluence.&#8203;api.&#8203;error.&#8203;login</td>
    <td>Failed to login to Confluence</td>
</tr>
<tr>
    <td>app.&#8203;confluence.&#8203;api.&#8203;error.&#8203;logout</td>
    <td>Failed to logout from Confluence</td>
</tr>
<tr>
    <td>app.&#8203;confluence.&#8203;api.&#8203;error.&#8203;parse.&#8203;groups</td>
    <td>Failed to parse group information from Confluence</td>
</tr>
<tr>
    <td>app.&#8203;confluence.&#8203;api.&#8203;error.&#8203;deactivate.&#8203;user</td>
    <td>Failed to deactivate user from Confluence</td>
</tr>
<tr>
    <td>app.&#8203;confluence.&#8203;api.&#8203;error.&#8203;reactivate.&#8203;user</td>
    <td>Failed to reactivate user from Confluence</td>
</tr>
<tr>
    <td>app.&#8203;confluence.&#8203;api.&#8203;error.&#8203;check.&#8203;user.&#8203;exists</td>
    <td>Failed to verify a user exists from Confluence</td>
</tr>
<tr>
    <td>app.&#8203;confluence.&#8203;api.&#8203;error.&#8203;check.&#8203;group.&#8203;exists</td>
    <td>Failed to verify a group exists from Confluence</td>
</tr>
<tr>
    <td>app.&#8203;confluence.&#8203;api.&#8203;error.&#8203;get.&#8203;user</td>
    <td>Failed to download a user from Confluence</td>
</tr>
<tr>
    <td>app.&#8203;confluence.&#8203;api.&#8203;error.&#8203;convert.&#8203;remote.&#8203;user.&#8203;to.&#8203;app.&#8203;user</td>
    <td>Failed to convert a remote user to an app user</td>
</tr>
<tr>
    <td>app.&#8203;confluence.&#8203;api.&#8203;error.&#8203;convert.&#8203;app.&#8203;user.&#8203;to.&#8203;remote.&#8203;user</td>
    <td>Failed to convert an app user to a remote user</td>
</tr>
<tr>
    <td>app.&#8203;confluence.&#8203;api.&#8203;error.&#8203;download.&#8203;users</td>
    <td>Failed to download all user from Confluence</td>
</tr>
<tr>
    <td>app.&#8203;confluence.&#8203;api.&#8203;error.&#8203;create.&#8203;new.&#8203;user</td>
    <td>Failed to create new a user</td>
</tr>
<tr>
    <td>app.&#8203;confluence.&#8203;api.&#8203;error.&#8203;remove.&#8203;user</td>
    <td>Failed to remove a user from Confluence</td>
</tr>
<tr>
    <td>app.&#8203;confluence.&#8203;api.&#8203;error.&#8203;create.&#8203;new.&#8203;group</td>
    <td>Failed to create new a group</td>
</tr>
<tr>
    <td>app.&#8203;confluence.&#8203;api.&#8203;error.&#8203;remove.&#8203;group</td>
    <td>Failed to remove a group from Confluence</td>
</tr>
<tr>
    <td>app.&#8203;confluence.&#8203;api.&#8203;error.&#8203;add.&#8203;user.&#8203;to.&#8203;group</td>
    <td>Failed to assign a user to a group from Confluence</td>
</tr>
<tr>
    <td>app.&#8203;confluence.&#8203;api.&#8203;error.&#8203;remove.&#8203;user.&#8203;to.&#8203;group</td>
    <td>Failed to remove a user from a group from Confluence</td>
</tr>
<tr>
    <td>app.&#8203;confluence.&#8203;api.&#8203;error.&#8203;get.&#8203;user.&#8203;groups</td>
    <td>Failed to download a user's groups from Confluence</td>
</tr>
<tr>
    <td>app.&#8203;confluence.&#8203;api.&#8203;error.&#8203;push.&#8203;password.&#8203;update</td>
    <td>Failed to push a new password to a user to Confluence</td>
</tr>
<tr>
    <td>app.&#8203;confluence.&#8203;api.&#8203;error.&#8203;push.&#8203;profile.&#8203;update</td>
    <td>Failed to push a profile to a user to Confluence</td>
</tr>
<tr>
    <td>app.&#8203;confluence.&#8203;api.&#8203;error.&#8203;import.&#8203;user.&#8203;profile</td>
    <td>Failed to download a user's profile from Confluence</td>
</tr>
</tbody></table>

#### SugarCRM

<table style="table-layout-fixed table-layout-fixed-events">
    
    <col width="377px" />
    <col width="309px" />
    <thead>
        <tr>
            <th>ObjectType</th>
            <th>Description</th>
        </tr>
    </thead>
<tbody>
<tr>
    <td>app.&#8203;sugarcrm.&#8203;api.&#8203;error.&#8203;login</td>
    <td>Failed to login to SugarCRM</td>
</tr>
<tr>
    <td>app.&#8203;sugarcrm.&#8203;api.&#8203;error.&#8203;logout</td>
    <td>Failed to logout from SugarCRM</td>
</tr>
<tr>
    <td>app.&#8203;sugarcrm.&#8203;api.&#8203;error.&#8203;hash.&#8203;password</td>
    <td>Failed to hash password</td>
</tr>
<tr>
    <td>app.&#8203;sugarcrm.&#8203;api.&#8203;error.&#8203;set.&#8203;entry</td>
    <td>Failed to set entry</td>
</tr>
<tr>
    <td>app.&#8203;sugarcrm.&#8203;api.&#8203;error.&#8203;get.&#8203;entry.&#8203;list</td>
    <td>Failed to get entry list</td>
</tr>
<tr>
    <td>app.&#8203;sugarcrm.&#8203;api.&#8203;error.&#8203;download.&#8203;server.&#8203;set.&#8203;values</td>
    <td>Failed to download values from SugarCRM</td>
</tr>
<tr>
    <td>app.&#8203;sugarcrm.&#8203;api.&#8203;error.&#8203;deactivate.&#8203;user</td>
    <td>Failed to deactivate user from SugarCRM</td>
</tr>
<tr>
    <td>app.&#8203;sugarcrm.&#8203;api.&#8203;error.&#8203;reactivate.&#8203;user</td>
    <td>Failed to reactivate user from SugarCRM</td>
</tr>
<tr>
    <td>app.&#8203;sugarcrm.&#8203;api.&#8203;error.&#8203;check.&#8203;user.&#8203;exists</td>
    <td>Failed to verify a user exists from SugarCRM</td>
</tr>
<tr>
    <td>app.&#8203;sugarcrm.&#8203;api.&#8203;error.&#8203;download.&#8203;users</td>
    <td>Failed to download all user from SugarCRM</td>
</tr>
<tr>
    <td>app.&#8203;sugarcrm.&#8203;api.&#8203;error.&#8203;create.&#8203;new.&#8203;user</td>
    <td>Failed to create a new user</td>
</tr>
<tr>
    <td>app.&#8203;sugarcrm.&#8203;api.&#8203;error.&#8203;push.&#8203;password.&#8203;update</td>
    <td>Failed to push a new password to a user to SugarCRM</td>
</tr>
<tr>
    <td>app.&#8203;sugarcrm.&#8203;api.&#8203;error.&#8203;push.&#8203;profile.&#8203;update</td>
    <td>Failed to push a profile to a user to SugarCRM</td>
</tr>
<tr>
    <td>app.&#8203;sugarcrm.&#8203;api.&#8203;error.&#8203;import.&#8203;user.&#8203;profile</td>
    <td>Failed to download a user's profile from SugarCRM</td>
</tr>
</tbody></table>

#### Jira

<table style="table-layout-fixed table-layout-fixed-events">
    
    <col width="377px" />
    <col width="309px" />
    <thead>
        <tr>
            <th>ObjectType</th>
            <th>Description</th>
        </tr>
    </thead>
<tbody>
<tr>
    <td>jiraLoginFailed</td>
    <td>Could not connect to the Jira API, please check your API Endpoint and Key</td>
</tr>
<tr>
    <td>app.&#8203;jira.&#8203;api.&#8203;error.&#8203;binding</td>
    <td>Failed to bind with Jira. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;jira.&#8203;api.&#8203;error.&#8203;login</td>
    <td>Failed to login to Jira. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;jira.&#8203;api.&#8203;error.&#8203;logout</td>
    <td>Failed to logout from Jira. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;jira.&#8203;api.&#8203;error.&#8203;check.&#8203;user.&#8203;exists</td>
    <td>Failed to verify a user exists from Jira. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;jira.&#8203;api.&#8203;error.&#8203;get.&#8203;user</td>
    <td>Failed to download a user from Jira. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;jira.&#8203;api.&#8203;error.&#8203;convert.&#8203;remote.&#8203;user.&#8203;to.&#8203;app.&#8203;user</td>
    <td>Failed to convert a remote user to an app user. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;jira.&#8203;api.&#8203;error.&#8203;convert.&#8203;app.&#8203;user.&#8203;to.&#8203;remote.&#8203;user</td>
    <td>Failed to convert an app user to a remote user. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;jira.&#8203;api.&#8203;error.&#8203;download.&#8203;users</td>
    <td>Failed to download all user from Jira. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;jira.&#8203;api.&#8203;error.&#8203;create.&#8203;new.&#8203;user</td>
    <td>Failed to create new a user. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;jira.&#8203;api.&#8203;error.&#8203;push.&#8203;password.&#8203;update</td>
    <td>Failed to push a new password to a user to Jira. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;jira.&#8203;api.&#8203;error.&#8203;push.&#8203;profile.&#8203;update</td>
    <td>Failed to push a profile to a user to Jira. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;jira.&#8203;api.&#8203;error.&#8203;import.&#8203;user.&#8203;profile</td>
    <td>Failed to download a user's profile from Jira. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;jira.&#8203;api.&#8203;error.&#8203;upsert.&#8203;group</td>
    <td>Failed to create a new user group. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;jira.&#8203;api.&#8203;error.&#8203;delete.&#8203;group</td>
    <td>Failed to delete user group. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;jira.&#8203;api.&#8203;error.&#8203;update.&#8203;group.&#8203;membership</td>
    <td>Failed to update users in group. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;jira.&#8203;api.&#8203;error.&#8203;download.&#8203;server.&#8203;set.&#8203;values</td>
    <td>Failed to download user groups list. ${app_error_code}</td>
</tr>
</tbody></table>

#### ServiceNow

<table style="table-layout-fixed table-layout-fixed-events">
    
    <col width="377px" />
    <col width="309px" />
    <thead>
        <tr>
            <th>ObjectType</th>
            <th>Description</th>
        </tr>
    </thead>
<tbody>
<tr>
    <td>servicenowLoginFailed</td>
    <td>Could not verify the ServiceNow administrator login and password; please confirm that these are set correctly. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;servicenow.&#8203;api.&#8203;error.&#8203;binding.&#8203;user</td>
    <td>Failed to bind with ServiceNow. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;servicenow.&#8203;api.&#8203;error.&#8203;download.&#8203;users</td>
    <td>Failed to download all user from ServiceNow. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;servicenow.&#8203;api.&#8203;error.&#8203;create.&#8203;new.&#8203;user</td>
    <td>Failed to create new a user. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;servicenow.&#8203;api.&#8203;error.&#8203;check.&#8203;user.&#8203;exists</td>
    <td>Failed to verify a user exists from ServiceNow. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;servicenow.&#8203;api.&#8203;error.&#8203;push.&#8203;password.&#8203;update</td>
    <td>Failed to push a new password to a user to ServiceNow. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;servicenow.&#8203;api.&#8203;error.&#8203;push.&#8203;profile.&#8203;update</td>
    <td>Failed to push a profile to a user to ServiceNow. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;servicenow.&#8203;api.&#8203;error.&#8203;deactivate.&#8203;user</td>
    <td>Failed to deactivate user from ServiceNow. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;servicenow.&#8203;api.&#8203;error.&#8203;reactivate.&#8203;user</td>
    <td>Failed to reactivate user from ServiceNow. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;servicenow.&#8203;api.&#8203;error.&#8203;validation</td>
    <td>Failed to validate your Admin credentials. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;servicenow.&#8203;api.&#8203;error.&#8203;get.&#8203;keys.&#8203;by.&#8203;user.&#8203;id</td>
    <td>Failed to fetch user. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;servicenow.&#8203;api.&#8203;error.&#8203;get.&#8203;departments</td>
    <td>Failed to download departments list from ServiceNow. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;servicenow.&#8203;api.&#8203;error.&#8203;get.&#8203;locations</td>
    <td>Failed to download locations list from ServiceNow. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;servicenow.&#8203;api.&#8203;error.&#8203;get.&#8203;costcenters</td>
    <td>Failed to download cost centers list from ServiceNow. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;servicenow.&#8203;api.&#8203;error.&#8203;import.&#8203;manager.&#8203;profile</td>
    <td>Failed to resolve ServiceNow manager hash: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;servicenow.&#8203;api.&#8203;error.&#8203;import.&#8203;user.&#8203;profile</td>
    <td>Failed to download a user's profile from ServiceNow. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;servicenow_app2.&#8203;api.&#8203;validation.&#8203;failure</td>
    <td>Could not verify the ServiceNow administrator login and password; please confirm that these are set correctly.</td>
</tr>
<tr>
    <td>app.&#8203;servicenow_app2.&#8203;api.&#8203;error.&#8203;binding.&#8203;user</td>
    <td>Failed to bind with ServiceNow. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;servicenow_app2.&#8203;api.&#8203;error.&#8203;download.&#8203;users</td>
    <td>Failed to download all user from ServiceNow. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;servicenow_app2.&#8203;api.&#8203;error.&#8203;create.&#8203;new.&#8203;user</td>
    <td>Failed to create new a user. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;servicenow_app2.&#8203;api.&#8203;error.&#8203;check.&#8203;user.&#8203;exists</td>
    <td>Failed to verify a user exists from ServiceNow. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;servicenow_app2.&#8203;api.&#8203;error.&#8203;push.&#8203;password.&#8203;update</td>
    <td>Failed to push a new password to a user to ServiceNow. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;servicenow_app2.&#8203;api.&#8203;error.&#8203;push.&#8203;profile.&#8203;update</td>
    <td>Failed to push a profile to a user to ServiceNow. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;servicenow_app2.&#8203;api.&#8203;error.&#8203;import.&#8203;user.&#8203;profile</td>
    <td>Failed to download a user profile from ServiceNow. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;servicenow_app2.&#8203;api.&#8203;error.&#8203;deactivate.&#8203;user</td>
    <td>Failed to deactivate user from ServiceNow. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;servicenow_app2.&#8203;api.&#8203;error.&#8203;reactivate.&#8203;user</td>
    <td>Failed to reactivate user from ServiceNow. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;servicenow_app2.&#8203;api.&#8203;error.&#8203;validation</td>
    <td>Failed to validate your Admin credentials. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;servicenow_app2.&#8203;api.&#8203;error.&#8203;get.&#8203;keys.&#8203;by.&#8203;user.&#8203;id</td>
    <td>Failed to fetch user. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;servicenow_app2.&#8203;api.&#8203;error.&#8203;get.&#8203;departments</td>
    <td>Failed to download departments list from ServiceNow. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;servicenow_app2.&#8203;api.&#8203;error.&#8203;get.&#8203;locations</td>
    <td>Failed to download locations list from ServiceNow. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;servicenow_app2.&#8203;api.&#8203;error.&#8203;get.&#8203;costcenters</td>
    <td>Failed to download cost centers list from ServiceNow. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;servicenow_app2.&#8203;api.&#8203;error.&#8203;download.&#8203;groups</td>
    <td>Failed to get user groups from ServiceNow. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;servicenow_app2.&#8203;api.&#8203;error.&#8203;upsert.&#8203;group</td>
    <td>Failed to upsert group in ServiceNow. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;servicenow_app2.&#8203;api.&#8203;error.&#8203;delete.&#8203;group</td>
    <td>Failed to delete group in ServiceNow. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;servicenow_app2.&#8203;api.&#8203;error.&#8203;download.&#8203;group.&#8203;memberships</td>
    <td>Failed to get group memberships from ServiceNow. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;servicenow_app2.&#8203;api.&#8203;warn.&#8203;upsert.&#8203;group</td>
    <td>Failed to get existent group memberships from ServiceNow. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;servicenow_app2.&#8203;api.&#8203;error.&#8203;add.&#8203;group.&#8203;memberships</td>
    <td>Failed to add group membership in ServiceNow. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;servicenow_app2.&#8203;api.&#8203;error.&#8203;delete.&#8203;group.&#8203;memberships</td>
    <td>Failed to delete group membership in ServiceNow. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;servicenow_app2.&#8203;api.&#8203;error.&#8203;import.&#8203;manager.&#8203;profile</td>
    <td>Failed to find manager profile in AD ${app_error_code}</td>
</tr>
</tbody></table>

#### Coupa

<table style="table-layout-fixed table-layout-fixed-events">
    
    <col width="377px" />
    <col width="309px" />
    <thead>
        <tr>
            <th>ObjectType</th>
            <th>Description</th>
        </tr>
    </thead>
<tbody>
<tr>
    <td>app.&#8203;coupa.&#8203;api.&#8203;connection.&#8203;error</td>
    <td>Failed to connect to Coupa API</td>
</tr>
</tbody></table>

#### MSBPOS

<table style="table-layout-fixed table-layout-fixed-events">
    
    <col width="377px" />
    <col width="309px" />
    <thead>
        <tr>
            <th>ObjectType</th>
            <th>Description</th>
        </tr>
    </thead>
<tbody>
<tr>
    <td>app.&#8203;msbpos.&#8203;api.&#8203;error.&#8203;validate.&#8203;creds</td>
    <td>Failed to validate MSBPOS Credentials</td>
</tr>
<tr>
    <td>app.&#8203;msbpos.&#8203;api.&#8203;error.&#8203;deactivate.&#8203;user</td>
    <td>Failed to deactivate user in MSBPOS:</td>
</tr>
<tr>
    <td>app.&#8203;msbpos.&#8203;api.&#8203;error.&#8203;check.&#8203;user.&#8203;exists</td>
    <td>Failed while checking for user in MSBPOS</td>
</tr>
<tr>
    <td>app.&#8203;msbpos.&#8203;api.&#8203;error.&#8203;activate.&#8203;license</td>
    <td>Failed to add license to user in MSBPOS</td>
</tr>
<tr>
    <td>app.&#8203;msbpos.&#8203;api.&#8203;error.&#8203;get.&#8203;subscription</td>
    <td>Failed to find subscription id in MSBPOS</td>
</tr>
<tr>
    <td>app.&#8203;msbpos.&#8203;api.&#8203;error.&#8203;push.&#8203;password</td>
    <td>Failed to push password to MSBPOS</td>
</tr>
<tr>
    <td>app.&#8203;msbpos.&#8203;api.&#8203;error.&#8203;create.&#8203;user</td>
    <td>Failed to create user in MSBPOS</td>
</tr>
</tbody></table>

#### BIG Machines

<table style="table-layout-fixed table-layout-fixed-events">
    
    <col width="377px" />
    <col width="309px" />
    <thead>
        <tr>
            <th>ObjectType</th>
            <th>Description</th>
        </tr>
    </thead>
<tbody>
<tr>
    <td>app.&#8203;bigmachines.&#8203;api.&#8203;error.&#8203;connection</td>
    <td>Failed to connect to BigMachines</td>
</tr>
<tr>
    <td>app.&#8203;bigmachines.&#8203;api.&#8203;error.&#8203;login</td>
    <td>Failed to authenticate against BigMachines</td>
</tr>
<tr>
    <td>app.&#8203;bigmachines.&#8203;api.&#8203;error.&#8203;logout</td>
    <td>Failed to logout from BigMachines</td>
</tr>
<tr>
    <td>app.&#8203;bigmachines.&#8203;api.&#8203;error.&#8203;check.&#8203;user.&#8203;exists</td>
    <td>Failed to check if user exists in BigMachines</td>
</tr>
<tr>
    <td>app.&#8203;bigmachines.&#8203;api.&#8203;error.&#8203;profile.&#8203;update</td>
    <td>Failed to update profile for user in BigMachines</td>
</tr>
<tr>
    <td>app.&#8203;bigmachines.&#8203;api.&#8203;error.&#8203;create</td>
    <td>Failed to create in BigMachines</td>
</tr>
<tr>
    <td>app.&#8203;bigmachines.&#8203;api.&#8203;error.&#8203;import</td>
    <td>Failed to import user in BigMachines</td>
</tr>
<tr>
    <td>app.&#8203;bigmachines.&#8203;api.&#8203;error.&#8203;deactivate</td>
    <td>Failed to deactivate user in BigMachines</td>
</tr>
<tr>
    <td>app.&#8203;bigmachines.&#8203;api.&#8203;error.&#8203;activate</td>
    <td>Failed to Activate user in BigMachines</td>
</tr>
</tbody></table>

#### CentralDesktop

<table style="table-layout-fixed table-layout-fixed-events">
    
    <col width="377px" />
    <col width="309px" />
    <thead>
        <tr>
            <th>ObjectType</th>
            <th>Description</th>
        </tr>
    </thead>
<tbody>
<tr>
    <td>app.&#8203;centraldesktop.&#8203;api.&#8203;error.&#8203;connection</td>
    <td>Failed to connect to CentralDesktop</td>
</tr>
<tr>
    <td>app.&#8203;centraldesktop.&#8203;api.&#8203;error.&#8203;login</td>
    <td>Failed to authenticate against CentralDesktop</td>
</tr>
<tr>
    <td>app.&#8203;centraldesktop.&#8203;api.&#8203;error.&#8203;logout</td>
    <td>Failed to logout from CentralDesktop</td>
</tr>
<tr>
    <td>app.&#8203;centraldesktop.&#8203;api.&#8203;error.&#8203;check.&#8203;user.&#8203;exists</td>
    <td>Failed to check if user exists in CentralDesktop</td>
</tr>
<tr>
    <td>app.&#8203;centraldesktop.&#8203;api.&#8203;error.&#8203;profile.&#8203;update</td>
    <td>Failed to update profile for user in CentralDesktop</td>
</tr>
<tr>
    <td>app.&#8203;centraldesktop.&#8203;api.&#8203;error.&#8203;create</td>
    <td>Failed to create user in CentralDesktop</td>
</tr>
<tr>
    <td>app.&#8203;centraldesktop.&#8203;api.&#8203;error.&#8203;import</td>
    <td>Failed to import user in CentralDesktop</td>
</tr>
<tr>
    <td>app.&#8203;centraldesktop.&#8203;api.&#8203;error.&#8203;deactivate</td>
    <td>Failed to deactivate user in CentralDesktop</td>
</tr>
<tr>
    <td>app.&#8203;centraldesktop.&#8203;api.&#8203;error.&#8203;password.&#8203;update</td>
    <td>Failed to update user password in CentralDesktop</td>
</tr>
</tbody></table>

#### Office365

<table style="table-layout-fixed table-layout-fixed-events">
    
    <col width="377px" />
    <col width="309px" />
    <thead>
        <tr>
            <th>ObjectType</th>
            <th>Description</th>
        </tr>
    </thead>
<tbody>
<tr>
    <td>app.&#8203;office365.&#8203;api.&#8203;error.&#8203;validate.&#8203;creds</td>
    <td>Could not validate your Office 365 credentials, received error: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;office365.&#8203;api.&#8203;error.&#8203;validate.&#8203;creds.&#8203;unknown.&#8203;exception</td>
    <td>Could not communicate with Office 365 to validate your credentials, received error: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;office365.&#8203;api.&#8203;error.&#8203;download.&#8203;custom.&#8203;objects</td>
    <td>Could not download group/role/license data for your Office 365 instance, received error: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;office365.&#8203;api.&#8203;error.&#8203;download.&#8203;users</td>
    <td>Could not download all users from your Office 365 instance, received error: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;office365.&#8203;api.&#8203;error.&#8203;download.&#8203;groups</td>
    <td>Could not download all groups from your Office 365 instance, received error: {app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;office365.&#8203;api.&#8203;error.&#8203;deactivate.&#8203;user</td>
    <td>Could not deactivate Office 365 user, received error: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;office365.&#8203;api.&#8203;error.&#8203;reactivate.&#8203;user</td>
    <td>Could not reactivate Office 365 user, received error: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;office365.&#8203;api.&#8203;error.&#8203;check.&#8203;user.&#8203;exists</td>
    <td>Could not determine status of Office 365 user, received error: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;office365.&#8203;api.&#8203;error.&#8203;push.&#8203;password</td>
    <td>Could not push password for Office 365 user, received error: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;office365.&#8203;api.&#8203;error.&#8203;create.&#8203;user</td>
    <td>Could not create user in Office 365, received error: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;office365.&#8203;api.&#8203;error.&#8203;push.&#8203;profile</td>
    <td>Could not push profile for Office 365 user, received error: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;office365.&#8203;api.&#8203;error.&#8203;import.&#8203;profile</td>
    <td>Could not import profile for Office 365 user, received error: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;office365.&#8203;api.&#8203;error.&#8203;ad.&#8203;user</td>
    <td>User is assigned to more than one instance of Active Directory, could not set Immutable ID</td>
</tr>
<tr>
    <td>app.&#8203;office365.&#8203;api.&#8203;error.&#8203;no.&#8203;endpoints.&#8203;found</td>
    <td>No Office 365 endpoint found to send our request.</td>
</tr>
<tr>
    <td>app.&#8203;office365.&#8203;api.&#8203;error.&#8203;endpoint.&#8203;unavailable</td>
    <td>Unable to reach the Office 365 endpoint: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;office365.&#8203;api.&#8203;error.&#8203;group.&#8203;create.&#8203;failure</td>
    <td>Could not create Office 365 group, received error: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;office365.&#8203;api.&#8203;error.&#8203;group.&#8203;create.&#8203;failure.&#8203;name.&#8203;in.&#8203;use</td>
    <td>Could not create Office 365 group because the name is already in use, received error: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;office365.&#8203;api.&#8203;error.&#8203;group.&#8203;update.&#8203;failure</td>
    <td>Could not update Office 365 group, received error: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;office365.&#8203;api.&#8203;error.&#8203;group.&#8203;update.&#8203;failure.&#8203;not.&#8203;found</td>
    <td>Could not update Office 365 group because it was not found, received error: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;office365.&#8203;api.&#8203;error.&#8203;group.&#8203;delete.&#8203;failure</td>
    <td>Could not delete Office 365 group, received error: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;office365.&#8203;api.&#8203;error.&#8203;group.&#8203;membership.&#8203;update.&#8203;failure</td>
    <td>Could not update the Office 365 group membership, received error: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;office365.&#8203;api.&#8203;error.&#8203;group.&#8203;membership.&#8203;update.&#8203;removal.&#8203;failure</td>
    <td>Could not update the Office 365 group membership because of an error removing a user from the group, received error: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;office365.&#8203;api.&#8203;error.&#8203;group.&#8203;membership.&#8203;update.&#8203;assignment.&#8203;failure</td>
    <td>Could not update the Office 365 group membership because of an error assigning a user to the group, received error: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;office365.&#8203;api.&#8203;error.&#8203;group.&#8203;membership.&#8203;update.&#8203;group.&#8203;not.&#8203;found.&#8203;failure</td>
    <td>Could not update the Office 365 group membership because the group could not be found, received error: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;office365.&#8203;api.&#8203;error.&#8203;set.&#8203;company.&#8203;dirsync.&#8203;failure</td>
    <td>Unable to enable Office 365 directory sync for the company, received error: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;office365.&#8203;api.&#8203;error.&#8203;set.&#8203;domain.&#8203;federation.&#8203;failure</td>
    <td>Unable to setup the domain federation, received error: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;office365.&#8203;api.&#8203;error.&#8203;remove.&#8203;domain.&#8203;federation.&#8203;failure</td>
    <td>Unable to remove the domain federation, received error: {0}</td>
</tr>
<tr>
    <td>app.&#8203;office365.&#8203;api.&#8203;sync.&#8203;complete</td>
    <td>Sync completed. countUser=${count_user}, countUserFailure=${count_user_failure}, countGroup=${count_group}, countGroupFailure=${count_group_failure}, countContact=${count_contact}, countContactFailure=${count_contact_failure}</td>
</tr>
<tr>
    <td>app.&#8203;office365.&#8203;api.&#8203;error.&#8203;sync</td>
    <td>Failed to sync any object to Office 365, received error: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;office365.&#8203;api.&#8203;error.&#8203;sync.&#8203;finalize</td>
    <td>Failed to finalize export to Office 365, received error: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;office365.&#8203;api.&#8203;error.&#8203;sync.&#8203;group</td>
    <td>Failed to sync group, received error: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;office365.&#8203;api.&#8203;error.&#8203;sync.&#8203;user</td>
    <td>Failed to sync user, received error: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;office365.&#8203;api.&#8203;error.&#8203;sync.&#8203;contact</td>
    <td>Failed to sync contact, received error: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;office365.&#8203;api.&#8203;error.&#8203;x-ms-forwarded-client-ip-header.&#8203;absent</td>
    <td>X-MS-Forwarded-Client-IP header either empty or not found in the request.</td>
</tr>
<tr>
    <td>app.&#8203;office365.&#8203;api.&#8203;error.&#8203;no-license-found</td>
    <td>No Office 365 license is specified for the user</td>
</tr>
<tr>
    <td>app.&#8203;office365.&#8203;api.&#8203;error.&#8203;multiple-licenses-found</td>
    <td>Multiple license types selected to be assigned to the user. Only one license type allowed to be selected</td>
</tr>
<tr>
    <td>app.&#8203;office365.&#8203;model.&#8203;validation.&#8203;adminusername.&#8203;field.&#8203;blank</td>
    <td>The admin username field cannot be left blank</td>
</tr>
<tr>
    <td>app.&#8203;office365.&#8203;model.&#8203;validation.&#8203;adminpassword.&#8203;field.&#8203;blank</td>
    <td>The admin password field cannot be left blank</td>
</tr>
<tr>
    <td>app.&#8203;office365.&#8203;model.&#8203;validation.&#8203;adminusername.&#8203;field.&#8203;invalid</td>
    <td>Please provide credentials for an Office 365 administrator who belongs to a separate domain than you are about to federate. If you do not have such user, please create an Office 365 user 'admin@yourcompany.onmicrosoft.com' that has the role 'Company Administrator'</td>
</tr>
</tbody></table>

#### Dropbox

<table style="table-layout-fixed table-layout-fixed-events">
    
    <col width="377px" />
    <col width="309px" />
    <thead>
        <tr>
            <th>ObjectType</th>
            <th>Description</th>
        </tr>
    </thead>
<tbody>
<tr>
    <td>dropboxVerifyFailed</td>
    <td>Could not connect to Dropbox API, please check your OAuth Token and Secret</td>
</tr>
<tr>
    <td>app.&#8203;dropbox.&#8203;api.&#8203;error.&#8203;validation</td>
    <td>Unable to validate Dropbox API configuration. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;dropbox.&#8203;api.&#8203;error.&#8203;check.&#8203;user</td>
    <td>Unable to check for user on Dropbox. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;dropbox.&#8203;api.&#8203;error.&#8203;download.&#8203;users</td>
    <td>Unable to download Dropbox users. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;dropbox.&#8203;api.&#8203;error.&#8203;import.&#8203;profile</td>
    <td>Unable to import user profile from Dropbox. Note that this feature will not work for users who are only INVITED. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;dropbox.&#8203;api.&#8203;error.&#8203;push.&#8203;profile</td>
    <td>Unable to push user profile to Dropbox. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;dropbox.&#8203;api.&#8203;error.&#8203;deactivation</td>
    <td>Unable to deactivate Dropbox user. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;dropbox.&#8203;api.&#8203;error.&#8203;create.&#8203;user</td>
    <td>Unable to create Dropbox user. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;dropbox.&#8203;api.&#8203;error.&#8203;push.&#8203;password.&#8203;update</td>
    <td>Unable to update password for the given Dropbox user. Note that this feature will not work for users who are only INVITED. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;dropbox.&#8203;api.&#8203;error.&#8203;query</td>
    <td>Unable to query Dropbox API. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;dropbox.&#8203;api.&#8203;error.&#8203;rateLimit.&#8203;exceeded</td>
    <td>Rate limit exceeded for Dropbox. ${app_error_code}</td>
</tr>
</tbody></table>

#### HipChat

<table style="table-layout-fixed table-layout-fixed-events">
    
    <col width="377px" />
    <col width="309px" />
    <thead>
        <tr>
            <th>ObjectType</th>
            <th>Description</th>
        </tr>
    </thead>
<tbody>
<tr>
    <td>hipchatVerifyFailed</td>
    <td>Could not connect to Hipchat API, please check your API Token</td>
</tr>
<tr>
    <td>app.&#8203;hipchat.&#8203;api.&#8203;error.&#8203;validation</td>
    <td>Unable to validate Hipchat API configuration. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;hipchat.&#8203;api.&#8203;error.&#8203;check.&#8203;user</td>
    <td>Unable to check for user on Hipchat. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;hipchat.&#8203;api.&#8203;error.&#8203;download.&#8203;users</td>
    <td>Unable to download Hipchat users. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;hipchat.&#8203;api.&#8203;error.&#8203;import.&#8203;profile</td>
    <td>Unable to import user profile from Hipchat. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;hipchat.&#8203;api.&#8203;error.&#8203;push.&#8203;profile</td>
    <td>Unable to push user profile to Hipchat. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;hipchat.&#8203;api.&#8203;error.&#8203;deactivation</td>
    <td>Unable to deactivate Hipchat user. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;hipchat.&#8203;api.&#8203;error.&#8203;reactivation</td>
    <td>Unable to reactivate Hipchat user. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;hipchat.&#8203;api.&#8203;error.&#8203;create.&#8203;user</td>
    <td>Unable to create Hipchat user. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;hipchat.&#8203;api.&#8203;error.&#8203;push.&#8203;password.&#8203;update</td>
    <td>Unable to update password for the given Hipchat user. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;hipchat.&#8203;api.&#8203;error.&#8203;query</td>
    <td>Unable to query Hipchat API. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;hipchat.&#8203;rateLimit.&#8203;exceeded</td>
    <td>Rate limit exceeded for Hipchat ${app_error_code}</td>
</tr>
</tbody></table>

#### Rightscale

<table style="table-layout-fixed table-layout-fixed-events">
    
    <col width="377px" />
    <col width="309px" />
    <thead>
        <tr>
            <th>ObjectType</th>
            <th>Description</th>
        </tr>
    </thead>
<tbody>
<tr>
    <td>RightscaleVerifyFailed</td>
    <td>Could not verify the Rightscale api username, password and id; please confirm that these are set correctly</td>
</tr>
<tr>
    <td>app.&#8203;rightscale.&#8203;api.&#8203;error.&#8203;validate</td>
    <td>Failed to validate Rightscale API credentials</td>
</tr>
<tr>
    <td>app.&#8203;rightscale.&#8203;api.&#8203;error.&#8203;download.&#8203;groups</td>
    <td>Failed to download group information from Rightscale</td>
</tr>
<tr>
    <td>app.&#8203;rightscale.&#8203;api.&#8203;error.&#8203;push.&#8203;profile</td>
    <td>Failed to push user profile to Rightscale: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;rightscale.&#8203;api.&#8203;error.&#8203;create.&#8203;user</td>
    <td>Failed to create new user in Rightscale: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;rightscale.&#8203;api.&#8203;error.&#8203;get.&#8203;users</td>
    <td>Failed to download users from Rightscale: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;rightscale.&#8203;api.&#8203;error.&#8203;login</td>
    <td>Failed to login to Rightscale: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;rightscale.&#8203;api.&#8203;error.&#8203;download.&#8203;users</td>
    <td>Failed to download users from Rightscale: ${app_error_code}</td>
</tr>
</tbody></table>

#### Box

<table style="table-layout-fixed table-layout-fixed-events">
    
    <col width="377px" />
    <col width="309px" />
    <thead>
        <tr>
            <th>ObjectType</th>
            <th>Description</th>
        </tr>
    </thead>
<tbody>
<tr>
    <td>app.&#8203;boxnet.&#8203;api.&#8203;error.&#8203;response</td>
    <td>Could not connect to Box. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;boxnet.&#8203;api.&#8203;error.&#8203;invalid_user_login</td>
    <td>User login is invalid. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;boxnet.&#8203;api.&#8203;error.&#8203;check_user_exists_external</td>
    <td>User already exists on Box, but is not part of Box Enterprise account. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;boxnet.&#8203;api.&#8203;error.&#8203;check_user_exists</td>
    <td>Could not verify that the user exists. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;boxnet.&#8203;api.&#8203;error.&#8203;deactivate_user</td>
    <td>Could not deactivate user. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;boxnet.&#8203;api.&#8203;error.&#8203;reactivate_user</td>
    <td>Could not reactivate user. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;boxnet.&#8203;api.&#8203;error.&#8203;download.&#8203;users</td>
    <td>Could not download users. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;boxnet.&#8203;api.&#8203;error.&#8203;create_new_user</td>
    <td>Could not create new user. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;boxnet.&#8203;api.&#8203;error.&#8203;push.&#8203;profile.&#8203;update</td>
    <td>Could not push profile update. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;boxnet.&#8203;api.&#8203;error.&#8203;import.&#8203;user.&#8203;profile</td>
    <td>Could not import user profile. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;boxnet.&#8203;api.&#8203;error.&#8203;download.&#8203;groups</td>
    <td>Could not download groups. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;boxnet.&#8203;api.&#8203;error.&#8203;download.&#8203;group_users</td>
    <td>Could not download group users. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;boxnet.&#8203;api.&#8203;error.&#8203;push.&#8203;groups_set</td>
    <td>Could not add user to specified groups. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;boxnet.&#8203;api.&#8203;error.&#8203;push.&#8203;remove_from_groups</td>
    <td>Could not remove user from specified groups. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;boxnet.&#8203;api.&#8203;error.&#8203;delete.&#8203;group</td>
    <td>Could not delete group. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;boxnet.&#8203;api.&#8203;error.&#8203;create.&#8203;group</td>
    <td>Could not create group. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;boxnet.&#8203;api.&#8203;error.&#8203;update.&#8203;group</td>
    <td>Could not update group. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;boxnet.&#8203;api.&#8203;error.&#8203;user.&#8203;push.&#8203;conflict_in_group</td>
    <td>Skipped push of conflicting user in Box.</td>
</tr>
<tr>
    <td>app.&#8203;boxnet.&#8203;api.&#8203;error.&#8203;validate_parent_folder</td>
    <td>Could not validate parent folder. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;boxnet.&#8203;api.&#8203;error.&#8203;create_personal_folder</td>
    <td>Could not create personal folder. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;boxnet.&#8203;api.&#8203;error.&#8203;create_personal_folder.&#8203;conflict</td>
    <td>In parent folder, personal folder already exists. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;boxnet.&#8203;api.&#8203;error.&#8203;personal_folder_sync_state</td>
    <td>Could not configure the personal folder to sync folder to desktop. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;boxnet.&#8203;api.&#8203;error.&#8203;assign_folder_permissions</td>
    <td>Could not assign folder permissions for personal folder. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;boxnet.&#8203;api.&#8203;error.&#8203;personal_folder_name</td>
    <td>Personal folder name is invalid for user. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;boxnet.&#8203;api.&#8203;error.&#8203;add.&#8203;email.&#8203;alias</td>
    <td>Could not add email alias ${alias} for user. ${app_error_code}</td>
</tr>
</tbody></table>

#### NetSuite

<table style="table-layout-fixed table-layout-fixed-events">
    
    <col width="377px" />
    <col width="309px" />
    <thead>
        <tr>
            <th>ObjectType</th>
            <th>Description</th>
        </tr>
    </thead>
<tbody>
<tr>
    <td>app.&#8203;netsuite.&#8203;api.&#8203;error.&#8203;auth</td>
    <td>Failed to authenticate with NetSuite</td>
</tr>
<tr>
    <td>app.&#8203;netsuite.&#8203;api.&#8203;error.&#8203;check_user_exists</td>
    <td>Failed to check if user exists on NetSuite</td>
</tr>
<tr>
    <td>app.&#8203;netsuite.&#8203;api.&#8203;error.&#8203;create_new_user</td>
    <td>Failed to create user in NetSuite</td>
</tr>
<tr>
    <td>app.&#8203;netsuite.&#8203;api.&#8203;error.&#8203;deactivate_user</td>
    <td>Failed to deactivate user in NetSuite</td>
</tr>
<tr>
    <td>app.&#8203;netsuite.&#8203;api.&#8203;error.&#8203;reactivate_user</td>
    <td>Failed to reactivate user in NetSuite</td>
</tr>
<tr>
    <td>app.&#8203;netsuite.&#8203;api.&#8203;error.&#8203;import_user_profile</td>
    <td>Failed to import user from NetSuite</td>
</tr>
<tr>
    <td>app.&#8203;netsuite.&#8203;api.&#8203;error.&#8203;download_custom_objects</td>
    <td>Failed to download roles from NetSuite</td>
</tr>
<tr>
    <td>app.&#8203;netsuite.&#8203;api.&#8203;error.&#8203;download_users</td>
    <td>Failed to download users from NetSuite</td>
</tr>
<tr>
    <td>app.&#8203;netsuite.&#8203;api.&#8203;error.&#8203;push_profile_update</td>
    <td>Failed to push profile update for user to NetSuite</td>
</tr>
<tr>
    <td>app.&#8203;netsuite.&#8203;api.&#8203;error.&#8203;push_password_update</td>
    <td>Failed to push password update for user in NetSuite</td>
</tr>
</tbody></table>

#### Concur

<table style="table-layout-fixed table-layout-fixed-events">
    
    <col width="377px" />
    <col width="309px" />
    <thead>
        <tr>
            <th>ObjectType</th>
            <th>Description</th>
        </tr>
    </thead>
<tbody>
<tr>
    <td>app.&#8203;concur.&#8203;api.&#8203;error.&#8203;auth</td>
    <td>Error authenticating against Concur: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;concur.&#8203;api.&#8203;error.&#8203;check_user_exists</td>
    <td>Error while verifying if user exists on Concur: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;concur.&#8203;api.&#8203;error.&#8203;create_user</td>
    <td>Error while creating Concur user: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;concur.&#8203;api.&#8203;error.&#8203;deactivate_user</td>
    <td>Error while deactivating user: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;concur.&#8203;api.&#8203;error.&#8203;reactivate_user</td>
    <td>Error while reactivating user: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;concur.&#8203;api.&#8203;error.&#8203;import_user_profile</td>
    <td>Error while trying to import Concur user profile for user: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;concur.&#8203;api.&#8203;error.&#8203;push_profile_update</td>
    <td>Error while trying to push Concur profile update for user: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;concur.&#8203;api.&#8203;error.&#8203;push_password_update</td>
    <td>Error pushing Concur password for user: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;concur.&#8203;api.&#8203;error.&#8203;generic</td>
    <td>Concur API error: ${app_error_code}</td>
</tr>
</tbody></table>

#### Lotus Domino

<table style="table-layout-fixed table-layout-fixed-events">
    
    <col width="377px" />
    <col width="309px" />
    <thead>
        <tr>
            <th>ObjectType</th>
            <th>Description</th>
        </tr>
    </thead>
<tbody>
<tr>
    <td>app.&#8203;lotus_domino.&#8203;api.&#8203;exception</td>
    <td>Error calling Lotus Domino API</td>
</tr>
<tr>
    <td>app.&#8203;lotus_domino.&#8203;api.&#8203;error.&#8203;push.&#8203;password.&#8203;update</td>
    <td>Error pushing password: ${app_error_code}</td>
</tr>
</tbody></table>

#### VeevaVault

<table style="table-layout-fixed table-layout-fixed-events">
    
    <col width="377px" />
    <col width="309px" />
    <thead>
        <tr>
            <th>ObjectType</th>
            <th>Description</th>
        </tr>
    </thead>
<tbody>
<tr>
    <td>veevaVaultLoginFailed</td>
    <td>Could not verify the Veeva Vault administrator login and password; please confirm that these are set correctly. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;veeva_vault.&#8203;api.&#8203;error.&#8203;binding.&#8203;user</td>
    <td>Failed to bind with Veeva Vault. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;veeva_vault.&#8203;api.&#8203;error.&#8203;download.&#8203;custom.&#8203;objects</td>
    <td>Could not download custom user data for your Veeva Vault instance. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;veeva_vault.&#8203;api.&#8203;error.&#8203;download.&#8203;users</td>
    <td>Failed to download users from Veeva Vault. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;veeva_vault.&#8203;api.&#8203;error.&#8203;create.&#8203;new.&#8203;user</td>
    <td>Failed to create new a user for Veeva Vault. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;veeva_vault.&#8203;api.&#8203;error.&#8203;check.&#8203;user.&#8203;exists</td>
    <td>Failed to verify a user exists from Veeva Vault. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;veeva_vault.&#8203;api.&#8203;error.&#8203;push.&#8203;profile.&#8203;update</td>
    <td>Failed to push a profile to a user to Veeva Vault. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;veeva_vault.&#8203;api.&#8203;error.&#8203;import.&#8203;user.&#8203;profile</td>
    <td>Failed to download a user's profile from Veeva Vault. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;veeva_vault.&#8203;api.&#8203;error.&#8203;deactivate.&#8203;user</td>
    <td>Failed to deactivate user from Veeva Vault. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;veeva_vault.&#8203;api.&#8203;error.&#8203;reactivate.&#8203;user</td>
    <td>Failed to reactivate user from Veeva Vault. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;veeva_vault.&#8203;api.&#8203;error.&#8203;validation</td>
    <td>Failed to validate your Admin credentials. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;veeva_vault.&#8203;api.&#8203;error.&#8203;get.&#8203;keys.&#8203;by.&#8203;user.&#8203;id</td>
    <td>Failed to fetch user. ${app_error_code}</td>
</tr>
</tbody></table>

#### Jive 6.0

<table style="table-layout-fixed table-layout-fixed-events">
    
    <col width="377px" />
    <col width="309px" />
    <thead>
        <tr>
            <th>ObjectType</th>
            <th>Description</th>
        </tr>
    </thead>
<tbody>
<tr>
    <td>jive60LoginFailed</td>
    <td>Could not verify the Jive administrator login and password; please confirm that these are set correctly.</td>
</tr>
<tr>
    <td>app.&#8203;jive60.&#8203;api.&#8203;error.&#8203;api.&#8203;validation</td>
    <td>Failed to validate Admin credentials. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;jive60.&#8203;api.&#8203;error.&#8203;auth</td>
    <td>Error authenticating against Jive: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;jive60.&#8203;api.&#8203;error.&#8203;check_user_exists</td>
    <td>Error while verifying if user exists on Jive: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;jive60.&#8203;api.&#8203;error.&#8203;create_user</td>
    <td>Error while creating Jive user: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;jive60.&#8203;api.&#8203;error.&#8203;deactivate_user</td>
    <td>Error while deactivating user: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;jive60.&#8203;api.&#8203;error.&#8203;reactivate_user</td>
    <td>Error while reactivating user: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;jive60.&#8203;api.&#8203;error.&#8203;import_user_profile</td>
    <td>Error while trying to import Jive user profile for user: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;jive60.&#8203;api.&#8203;error.&#8203;push_profile_update</td>
    <td>Error while trying to push Jive profile update for user: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;jive60.&#8203;api.&#8203;error.&#8203;push_password_update</td>
    <td>Error pushing Jive password for user: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;jive60.&#8203;api.&#8203;error.&#8203;upsert_group</td>
    <td>Error while creating Jive security user group: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;jive60.&#8203;api.&#8203;error.&#8203;upsert_group_duplicate</td>
    <td>Jive user group already exists. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;jive60.&#8203;api.&#8203;error.&#8203;delete_group</td>
    <td>Error while deleting Jive security user group: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;jive60.&#8203;api.&#8203;error.&#8203;update_group_membership</td>
    <td>Error while update Jive security user group membership for group: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;jive60.&#8203;api.&#8203;error.&#8203;download_users</td>
    <td>Error while downloading all users from Jive: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;jive60.&#8203;api.&#8203;error.&#8203;generic</td>
    <td>Jive API error: ${app_error_code}</td>
</tr>
</tbody></table>

#### Jive 4.5

<table style="table-layout-fixed table-layout-fixed-events">
    
    <col width="377px" />
    <col width="309px" />
    <thead>
        <tr>
            <th>ObjectType</th>
            <th>Description</th>
        </tr>
    </thead>
<tbody>
<tr>
    <td>jive45LoginFailed</td>
    <td>Could not verify the Jive administrator login and password; please confirm that these are set correctly.</td>
</tr>
<tr>
    <td>app.&#8203;jive45.&#8203;api.&#8203;error.&#8203;api.&#8203;validation</td>
    <td>Failed to validate Admin credentials. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;jive45.&#8203;api.&#8203;error.&#8203;auth</td>
    <td>Error authenticating against Jive: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;jive45.&#8203;api.&#8203;error.&#8203;check_user_exists</td>
    <td>Error while verifying if user exists on Jive: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;jive45.&#8203;api.&#8203;error.&#8203;create_user</td>
    <td>Error while creating Jive user: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;jive45.&#8203;api.&#8203;error.&#8203;deactivate_user</td>
    <td>Error while deactivating user: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;jive45.&#8203;api.&#8203;error.&#8203;reactivate_user</td>
    <td>Error while reactivating user: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;jive45.&#8203;api.&#8203;error.&#8203;import_user_profile</td>
    <td>Error while trying to import Jive user profile for user: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;jive45.&#8203;api.&#8203;error.&#8203;push_profile_update</td>
    <td>Error while trying to push Jive profile update for user: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;jive45.&#8203;api.&#8203;error.&#8203;push_password_update</td>
    <td>Error pushing Jive password for user: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;jive45.&#8203;api.&#8203;error.&#8203;upsert_group</td>
    <td>Error while creating Jive security user group: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;jive45.&#8203;api.&#8203;error.&#8203;upsert_group_duplicate</td>
    <td>Jive user group already exists. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;jive45.&#8203;api.&#8203;error.&#8203;delete_group</td>
    <td>Error while deleting Jive security user group: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;jive45.&#8203;api.&#8203;error.&#8203;update_group_membership</td>
    <td>Error while update Jive security user group membership for group: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;jive45.&#8203;api.&#8203;error.&#8203;download_users</td>
    <td>Error while downloading all users from Jive: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;jive45.&#8203;api.&#8203;error.&#8203;generic</td>
    <td>Jive API error: ${app_error_code}</td>
</tr>
</tbody></table>

#### Syncplicity

<table style="table-layout-fixed table-layout-fixed-events">
    
    <col width="377px" />
    <col width="309px" />
    <thead>
        <tr>
            <th>ObjectType</th>
            <th>Description</th>
        </tr>
    </thead>
<tbody>
<tr>
    <td>syncplicityLoginFailed</td>
    <td>Verification failed: ${app_error_code}</td>
</tr>
</tbody></table>

#### Bloomfire

<table style="table-layout-fixed table-layout-fixed-events">
    
    <col width="377px" />
    <col width="309px" />
    <thead>
        <tr>
            <th>ObjectType</th>
            <th>Description</th>
        </tr>
    </thead>
<tbody>
<tr>
    <td>app.&#8203;bloomfire.&#8203;api.&#8203;error.&#8203;login.&#8203;failed</td>
    <td>Could not verify the Bloomfire administrator login and password; please confirm that these are set correctly.</td>
</tr>
<tr>
    <td>app.&#8203;bloomfire.&#8203;api.&#8203;error.&#8203;api.&#8203;validation</td>
    <td>Failed to validate Admin credentials. {0}</td>
</tr>
<tr>
    <td>app.&#8203;bloomfire.&#8203;api.&#8203;error.&#8203;check_user_exists</td>
    <td>Error while verifying if user {0} exists in Bloomfire: {1}</td>
</tr>
<tr>
    <td>app.&#8203;bloomfire.&#8203;api.&#8203;error.&#8203;download_users</td>
    <td>Error while downloading all users from Bloomfire: {0}</td>
</tr>
<tr>
    <td>app.&#8203;bloomfire.&#8203;api.&#8203;error.&#8203;generic</td>
    <td>Bloomfire API error: {0}</td>
</tr>
<tr>
    <td>app.&#8203;bloomfire.&#8203;sso.&#8203;error.&#8203;user_not_extracted</td>
    <td>Failed to extract user from SignOnRequest</td>
</tr>
<tr>
    <td>app.&#8203;bloomfire.&#8203;sso.&#8203;error.&#8203;api_key_empty</td>
    <td>API Key is required for SignOn request</td>
</tr>
</tbody></table>

#### CornerStone

<table style="table-layout-fixed table-layout-fixed-events">
    
    <col width="377px" />
    <col width="309px" />
    <thead>
        <tr>
            <th>ObjectType</th>
            <th>Description</th>
        </tr>
    </thead>
<tbody>
<tr>
    <td>app.&#8203;cornerstone.&#8203;api.&#8203;error.&#8203;api.&#8203;validation</td>
    <td>Failed to validate the admin credentials against CornerStone On Demand</td>
</tr>
<tr>
    <td>app.&#8203;cornerstone.&#8203;api.&#8203;error.&#8203;auth</td>
    <td>Error authenticating against CornerStone On Demand</td>
</tr>
<tr>
    <td>app.&#8203;cornerstone.&#8203;api.&#8203;error.&#8203;init</td>
    <td>Failed to init CornerStone WebServices API</td>
</tr>
<tr>
    <td>app.&#8203;cornerstone.&#8203;api.&#8203;error.&#8203;api.&#8203;check_user_exists</td>
    <td>Failed to verify if user exists on CornerStone On Demand: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;cornerstone.&#8203;api.&#8203;error.&#8203;api.&#8203;password_push</td>
    <td>Failed to push the password to CornerStone On Demand: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;cornerstone.&#8203;api.&#8203;error.&#8203;api.&#8203;create_user</td>
    <td>Failed to create user in CornerStone On Demand: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;cornerstone.&#8203;api.&#8203;error.&#8203;api.&#8203;push_profile</td>
    <td>Failed to update profile in CornerStone On Demand: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;cornerstone.&#8203;api.&#8203;error.&#8203;api.&#8203;import_profile</td>
    <td>Failed to import profile from CornerStone On Demand: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;cornerstone.&#8203;api.&#8203;error.&#8203;api.&#8203;reactivate_user</td>
    <td>Failed to reactivate user in CornerStone On Demand: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;cornerstone.&#8203;api.&#8203;error.&#8203;api.&#8203;deactivate_user</td>
    <td>Failed to deactivate user in CornerStone On Demand: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;cornerstone.&#8203;api.&#8203;error.&#8203;auth.&#8203;unknown.&#8203;host</td>
    <td>Failed to connect to CornerStone On Demand. Please make sure that the CornerStone Organization Name has been entered correctly while configuring the General Settings</td>
</tr>
</tbody></table>

#### ExactTarget

<table style="table-layout-fixed table-layout-fixed-events">
    
    <col width="377px" />
    <col width="309px" />
    <thead>
        <tr>
            <th>ObjectType</th>
            <th>Description</th>
        </tr>
    </thead>
<tbody>
<tr>
    <td>app.&#8203;exacttarget.&#8203;api.&#8203;error.&#8203;check_user_exists</td>
    <td>Error while verifying if user exists on ExactTarget. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;exacttarget.&#8203;api.&#8203;error.&#8203;create_user</td>
    <td>Error while creating ExactTarget user. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;exacttarget.&#8203;api.&#8203;error.&#8203;deactivate_user</td>
    <td>Error while deactivatinguser in ExactTarget. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;exacttarget.&#8203;api.&#8203;error.&#8203;reactivate_user</td>
    <td>Error while reactivating user in ExactTarget. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;exacttarget.&#8203;api.&#8203;error.&#8203;import_user_profile</td>
    <td>Error while trying to import ExactTarget user profile. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;exacttarget.&#8203;api.&#8203;error.&#8203;push_profile_update</td>
    <td>Error while trying to push ExactTarget profile update. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;exacttarget.&#8203;api.&#8203;error.&#8203;push_password_update</td>
    <td>Error while trying to push ExactTarget password update. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;exacttarget.&#8203;api.&#8203;error.&#8203;download_users</td>
    <td>Error while downloading all users from ExactTarget. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;exacttarget.&#8203;api.&#8203;error.&#8203;init</td>
    <td>Error while client initialization. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;exacttarget.&#8203;api.&#8203;error.&#8203;generic</td>
    <td>ExactTarget API error: ${app_error_code}</td>
</tr>
</tbody></table>

#### MOVEit DMZ

<table style="table-layout-fixed table-layout-fixed-events">
    
    <col width="377px" />
    <col width="309px" />
    <thead>
        <tr>
            <th>ObjectType</th>
            <th>Description</th>
        </tr>
    </thead>
<tbody>
<tr>
    <td>moveit_dmz.&#8203;error.&#8203;too.&#8203;long.&#8203;username.&#8203;or.&#8203;email</td>
    <td>MOVEit DMZ username or email null or too long. Username and email: ${app_error_code}</td>
</tr>
</tbody></table>

#### Appature

<table style="table-layout-fixed table-layout-fixed-events">
    
    <col width="377px" />
    <col width="309px" />
    <thead>
        <tr>
            <th>ObjectType</th>
            <th>Description</th>
        </tr>
    </thead>
<tbody>
<tr>
    <td>app.&#8203;appature.&#8203;sso.&#8203;error.&#8203;allowed_accounts.&#8203;empty</td>
    <td>Allowed accounts regex is required</td>
</tr>
<tr>
    <td>app.&#8203;appature.&#8203;sso.&#8203;error.&#8203;groups.&#8203;empty</td>
    <td>Groups regex is required</td>
</tr>
<tr>
    <td>app.&#8203;appature.&#8203;sso.&#8203;error.&#8203;allowed_accounts.&#8203;invalid_regex</td>
    <td>Allowed accounts regex is malformed</td>
</tr>
<tr>
    <td>app.&#8203;appature.&#8203;sso.&#8203;error.&#8203;groups.&#8203;invalid_regex</td>
    <td>Groups regex is malformed</td>
</tr>
</tbody></table>

#### Benetrac

<table style="table-layout-fixed table-layout-fixed-events">
    
    <col width="377px" />
    <col width="309px" />
    <thead>
        <tr>
            <th>ObjectType</th>
            <th>Description</th>
        </tr>
    </thead>
<tbody>
<tr>
    <td>app.&#8203;benetrac.&#8203;sso.&#8203;error.&#8203;site_id.&#8203;empty</td>
    <td>SiteID is required</td>
</tr>
<tr>
    <td>app.&#8203;benetrac.&#8203;sso.&#8203;error.&#8203;partner_id.&#8203;empty</td>
    <td>PartnerID is required</td>
</tr>
</tbody></table>

#### Samanage

<table style="table-layout-fixed table-layout-fixed-events">
    
    <col width="377px" />
    <col width="309px" />
    <thead>
        <tr>
            <th>ObjectType</th>
            <th>Description</th>
        </tr>
    </thead>
<tbody>
<tr>
    <td>app.&#8203;samanage.&#8203;api.&#8203;error.&#8203;login.&#8203;failed</td>
    <td>Could not verify the SAManage administrator login and password; please confirm that these are set correctly.</td>
</tr>
<tr>
    <td>app.&#8203;samanage.&#8203;api.&#8203;error.&#8203;long_group_name</td>
    <td>Group name is too long (max length is 50 chars): ${app_error_code}</td>
</tr>
</tbody></table>

#### Egnyte

<table style="table-layout-fixed table-layout-fixed-events">
    
    <col width="377px" />
    <col width="309px" />
    <thead>
        <tr>
            <th>ObjectType</th>
            <th>Description</th>
        </tr>
    </thead>
<tbody>
<tr>
    <td>app.&#8203;egnyte.&#8203;username.&#8203;validation.&#8203;failure</td>
    <td>${app_error_code}. Please make sure that the Username matches Egnyte user naming convention</td>
</tr>
<tr>
    <td>app.&#8203;egnyte.&#8203;auth.&#8203;type.&#8203;validation.&#8203;failure</td>
    <td>Please make sure that you selected correct Authentication Type for user ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;egnyte.&#8203;rate.&#8203;limiting.&#8203;exceeded</td>
    <td>Rate limit exceeded for Egnyte. {app_error_code}</td>
</tr>
</tbody></table>

#### Duo

<table style="table-layout-fixed table-layout-fixed-events">
    
    <col width="377px" />
    <col width="309px" />
    <thead>
        <tr>
            <th>ObjectType</th>
            <th>Description</th>
        </tr>
    </thead>
<tbody>
<tr>
    <td>core.&#8203;user_auth.&#8203;duo.&#8203;disabled_lockout</td>
    <td>User failed to login because their Duo Security account is disabled or locked out</td>
</tr>
<tr>
    <td>core.&#8203;user_auth.&#8203;duo.&#8203;duo_down</td>
    <td>User failed to login because the system was unable to contact the Duo API to validate their factor</td>
</tr>
<tr>
    <td>core.&#8203;user_auth.&#8203;duo.&#8203;invalid_integration</td>
    <td>User failed to login because your Duo integration configuration is no longer valid.</td>
</tr>
<tr>
    <td>core.&#8203;user_auth.&#8203;duo.&#8203;enroll_incomplete</td>
    <td>User is unable to self-enroll with Duo Security because their account has a previous registration that was not complete</td>
</tr>
<tr>
    <td>core.&#8203;user_auth.&#8203;duo.&#8203;no_self_enroll_no_devices</td>
    <td>User failed to login because the user is not allowed to self-enroll and does not have any registered devices</td>
</tr>
</tbody></table>

#### Roambi

<table style="table-layout-fixed table-layout-fixed-events">
    
    <col width="377px" />
    <col width="309px" />
    <thead>
        <tr>
            <th>ObjectType</th>
            <th>Description</th>
        </tr>
    </thead>
<tbody>
<tr>
    <td>roambi.&#8203;api.&#8203;error.&#8203;deactivate_user.&#8203;confirmation</td>
    <td>Error while activating user: confirmation failed</td>
</tr>
<tr>
    <td>roambi.&#8203;api.&#8203;error.&#8203;reactivate_user.&#8203;confirmation</td>
    <td>Error while deactivating user: confirmation failed</td>
</tr>
<tr>
    <td>roambi.&#8203;api.&#8203;error.&#8203;auth.&#8203;unexpected.&#8203;response</td>
    <td>Unexpected authentication response. HTTP status: ${app_error_code}</td>
</tr>
<tr>
    <td>roambi.&#8203;api.&#8203;error.&#8203;auth.&#8203;empty.&#8203;code</td>
    <td>Authentication failure: received 'code' parameter is empty</td>
</tr>
<tr>
    <td>roambi.&#8203;api.&#8203;error.&#8203;auth.&#8203;empty.&#8203;account.&#8203;response</td>
    <td>Authentication failure: Failed to get account info - response is empty</td>
</tr>
</tbody></table>

#### Litmos

<table style="table-layout-fixed table-layout-fixed-events">
    
    <col width="377px" />
    <col width="309px" />
    <thead>
        <tr>
            <th>ObjectType</th>
            <th>Description</th>
        </tr>
    </thead>
<tbody>
<tr>
    <td>app.&#8203;litmos.&#8203;group.&#8203;push.&#8203;group_name_too_long</td>
    <td>The length of the name of your group is ${instance_id}, but Litmos allows only ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;litmos.&#8203;import.&#8203;rate_limit_exceeded</td>
    <td>${app_error_code}</td>
</tr>
</tbody></table>

#### Smartsheet

<table style="table-layout-fixed table-layout-fixed-events">
    
    <col width="377px" />
    <col width="309px" />
    <thead>
        <tr>
            <th>ObjectType</th>
            <th>Description</th>
        </tr>
    </thead>
<tbody>
<tr>
    <td>smartsheet.&#8203;rate.&#8203;limit.&#8203;exceeded</td>
    <td>Rate limit exceeded for Smartsheet. ${app_error_code}</td>
</tr>
</tbody></table>

#### GitHub

<table style="table-layout-fixed table-layout-fixed-events">
    
    <col width="377px" />
    <col width="309px" />
    <thead>
        <tr>
            <th>ObjectType</th>
            <th>Description</th>
        </tr>
    </thead>
<tbody>
<tr>
    <td>github.&#8203;api.&#8203;error.&#8203;user_not_found</td>
    <td>User ${app_username} does not exist in GitHub. Please check username or create user manually</td>
</tr>
<tr>
    <td>github.&#8203;api.&#8203;error.&#8203;rate_limit.&#8203;exceeded</td>
    <td>Rate limit exceeded for GitHub instance ${instance_id}</td>
</tr>
<tr>
    <td>github.&#8203;api.&#8203;error.&#8203;rate_limit.&#8203;reset_date</td>
    <td>Unable to get rate limit reset date [${app_error_code}] from Response for GitHub instance ${instance_id}</td>
</tr>
<tr>
    <td>github.&#8203;api.&#8203;error.&#8203;rate_limit.&#8203;remaining</td>
    <td>Unable to get rate limit remaining queries [${app_error_code}] from Response for GitHub instance ${instance_id}</td>
</tr>
</tbody></table>

#### DocuSign

<table style="table-layout-fixed table-layout-fixed-events">
    
    <col width="377px" />
    <col width="309px" />
    <thead>
        <tr>
            <th>ObjectType</th>
            <th>Description</th>
        </tr>
    </thead>
<tbody>
<tr>
    <td>app.&#8203;docusign.&#8203;api.&#8203;error.&#8203;no.&#8203;accounts</td>
    <td>Provided user is not member of any account</td>
</tr>
<tr>
    <td>app.&#8203;docusign.&#8203;api.&#8203;error.&#8203;not.&#8203;account.&#8203;member</td>
    <td>Provided user is not member of account ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;docusign.&#8203;api.&#8203;error.&#8203;update.&#8203;permission.&#8203;profile</td>
    <td>Failed to update user permission profile. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;docusign.&#8203;api.&#8203;error.&#8203;import.&#8203;permission.&#8203;profile</td>
    <td>Failed to import user permission profile. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;docusign.&#8203;api.&#8203;error.&#8203;update.&#8203;inactive.&#8203;user</td>
    <td>Failed to update user details - user is not active. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;docusign.&#8203;api.&#8203;error.&#8203;import.&#8203;inactive.&#8203;user</td>
    <td>Failed to get user details - user is not active. ${app_error_code}</td>
</tr>
</tbody></table>

#### Huddle

<table style="table-layout-fixed table-layout-fixed-events">
    
    <col width="377px" />
    <col width="309px" />
    <thead>
        <tr>
            <th>ObjectType</th>
            <th>Description</th>
        </tr>
    </thead>
<tbody>
<tr>
    <td>huddle.&#8203;company_id.&#8203;validation.&#8203;failure</td>
    <td>Company Id not specified.</td>
</tr>
<tr>
    <td>huddle.&#8203;rate.&#8203;limit.&#8203;exceeded</td>
    <td>You have exceeded rate limit for your client ID. Retrying after ${app_error_code}</td>
</tr>
</tbody></table>

#### PagerDuty

<table style="table-layout-fixed table-layout-fixed-events">
    
    <col width="377px" />
    <col width="309px" />
    <thead>
        <tr>
            <th>ObjectType</th>
            <th>Description</th>
        </tr>
    </thead>
<tbody>
<tr>
    <td>app.&#8203;pagerduty.&#8203;api.&#8203;auth.&#8203;error.&#8203;invalid.&#8203;admin.&#8203;username</td>
    <td>Incorrect admin username: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;pagerduty.&#8203;api.&#8203;auth.&#8203;error.&#8203;invalid.&#8203;admin.&#8203;role</td>
    <td>User provided is not admin or owner. Provided user role is ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;pagerduty.&#8203;api.&#8203;auth.&#8203;error.&#8203;invalid.&#8203;api.&#8203;key</td>
    <td>API key provided is invalid</td>
</tr>
<tr>
    <td>app.&#8203;pagerduty.&#8203;api.&#8203;push.&#8203;profile.&#8203;update.&#8203;unexpected.&#8203;status</td>
    <td>Unexpected status response while updating user: ${app_error_code}. 200 is expected.</td>
</tr>
<tr>
    <td>app.&#8203;pagerduty.&#8203;api.&#8203;deactivate.&#8203;user.&#8203;unexpected.&#8203;status</td>
    <td>Unexpected status response while deleting user: ${app_error_code}. 204 is expected.</td>
</tr>
</tbody></table>

#### Clarizen

<table style="table-layout-fixed table-layout-fixed-events">
    
    <col width="377px" />
    <col width="309px" />
    <thead>
        <tr>
            <th>ObjectType</th>
            <th>Description</th>
        </tr>
    </thead>
<tbody>
<tr>
    <td>app.&#8203;clarizen.&#8203;api.&#8203;error.&#8203;no_admin_rights</td>
    <td>Provided credentials does not contain administrator permissions</td>
</tr>
<tr>
    <td>app.&#8203;clarizen.&#8203;api.&#8203;error.&#8203;rate_limit.&#8203;exceeded</td>
    <td>Rate limit exceeded for Clarizen</td>
</tr>
<tr>
    <td>app.&#8203;clarizen.&#8203;api.&#8203;error.&#8203;entity.&#8203;not_found</td>
    <td>Requested Clarizen Entity was not found: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;clarizen.&#8203;api.&#8203;error.&#8203;update_group</td>
    <td>Unable to update Clarizen group: ${app_error_code}</td>
</tr>
</tbody></table>

#### CrashPlan Pro

<table style="table-layout-fixed table-layout-fixed-events">
    
    <col width="377px" />
    <col width="309px" />
    <thead>
        <tr>
            <th>ObjectType</th>
            <th>Description</th>
        </tr>
    </thead>
<tbody>
<tr>
    <td>app.&#8203;crashplanpro.&#8203;api.&#8203;invalid_set_of_roles</td>
    <td>Current API account does not have required roles to do API calls. It should have one of these roles: ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;crashplanpro.&#8203;api.&#8203;auth.&#8203;invalid_login_url</td>
    <td>Invalid login URL specified</td>
</tr>
<tr>
    <td>app.&#8203;crashplanpro.&#8203;api.&#8203;rest.&#8203;unexpected_response_status</td>
    <td>${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;crashplanpro.&#8203;api.&#8203;user_not_found</td>
    <td>User cannot be found in CrashPlan. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;crashplanpro.&#8203;api.&#8203;user_has_invalid_fields</td>
    <td>User has invalid fields, please verify and try again. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;crashplanpro.&#8203;api.&#8203;ambiguous_search_results_by_user</td>
    <td>Ambiguous search results. There are more than one user with same username was found. Username: ${app_error_code}</td>
</tr>
</tbody></table>

#### GoodData

<table style="table-layout-fixed table-layout-fixed-events">
    
    <col width="377px" />
    <col width="309px" />
    <thead>
        <tr>
            <th>ObjectType</th>
            <th>Description</th>
        </tr>
    </thead>
<tbody>
<tr>
    <td>gooddata.&#8203;api.&#8203;error.&#8203;no.&#8203;admin.&#8203;rights</td>
    <td>User is not a domain admin.</td>
</tr>
<tr>
    <td>gooddata.&#8203;api.&#8203;error.&#8203;project.&#8203;access.&#8203;forbidden</td>
    <td>Cannot access the project with admin credentials: ${app_error_code}</td>
</tr>
<tr>
    <td>gooddata.&#8203;api.&#8203;error.&#8203;project.&#8203;assignment.&#8203;failed</td>
    <td>Failed to assign user to the project ${app_error_code}.</td>
</tr>
<tr>
    <td>gooddata.&#8203;api.&#8203;error.&#8203;project.&#8203;not.&#8203;found</td>
    <td>Project ${app_error_code} not found.</td>
</tr>
<tr>
    <td>gooddata.&#8203;api.&#8203;error.&#8203;incorrect.&#8203;roles.&#8203;count</td>
    <td>Incorrect roles count for user ${app_error_code}: only zero or one role per project should be selected</td>
</tr>
</tbody></table>

#### Evernote Business

<table style="table-layout-fixed table-layout-fixed-events">
    
    <col width="377px" />
    <col width="309px" />
    <thead>
        <tr>
            <th>ObjectType</th>
            <th>Description</th>
        </tr>
    </thead>
<tbody>
<tr>
    <td>evernoteBusinessVerifyFailed</td>
    <td>Could not connect to Evernote Business API, please check your authentication Token</td>
</tr>
<tr>
    <td>app.&#8203;evernote_business.&#8203;api.&#8203;error.&#8203;validation</td>
    <td>Unable to validate Evernote API configuration. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;evernote_business.&#8203;api.&#8203;error.&#8203;deactivation</td>
    <td>Unable to deactivate Evernote user. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;evernote_business.&#8203;api.&#8203;error.&#8203;create.&#8203;user</td>
    <td>Unable to create Evernote user. ${app_error_code}</td>
</tr>
<tr>
    <td>app.&#8203;evernote_business.&#8203;api.&#8203;error.&#8203;create.&#8203;user.&#8203;limit.&#8203;reached</td>
    <td>Unable to create Evernote user. You have reached your maximum number of users. ${app_error_code}</td>
</tr>
</tbody></table>

#### Okta

<table style="table-layout-fixed table-layout-fixed-events">
    
    <col width="377px" />
    <col width="309px" />
    <thead>
        <tr>
            <th>ObjectType</th>
            <th>Description</th>
        </tr>
    </thead>
<tbody>
<tr>
    <td>app.&#8203;okta_org.&#8203;user_management.&#8203;error.&#8203;download_app_schema</td>
    <td>Error occured while downloading app schema</td>
</tr>
<tr>
    <td>app.&#8203;okta_org.&#8203;user_management.&#8203;error.&#8203;download_user_type</td>
    <td>Error occured while downloading user type</td>
</tr>
<tr>
    <td>app.&#8203;okta_org.&#8203;user_management.&#8203;error.&#8203;parse_schema</td>
    <td>Error occured while parsing user app schema</td>
</tr>
<tr>
    <td>app.&#8203;okta_org.&#8203;user_management.&#8203;error.&#8203;schema.&#8203;property.&#8203;not.&#8203;exist</td>
    <td>Json field={0} does not exist for object={1}</td>
</tr>
</tbody></table>

### Active Directory

<table style="table-layout-fixed table-layout-fixed-events">
    
    <col width="377px" />
    <col width="309px" />
    <thead>
        <tr>
            <th>ObjectType</th>
            <th>Description</th>
        </tr>
    </thead>
<tbody>
<tr>
    <td>app.&#8203;ad.&#8203;api.&#8203;user_import.&#8203;warn.&#8203;skipped_user.&#8203;internal_object</td>
    <td>Skipping the import of user '${distinguished_name}' because their account has attribute "iscriticalsystemobject" = true. Please consult with your Active Directory admin if you believe this user should be imported.</td>
</tr>
<tr>
    <td>app.&#8203;ad.&#8203;api.&#8203;user_import.&#8203;warn.&#8203;skipped_user.&#8203;invalid_user_account_control</td>
    <td>Skipping import of user '${distinguished_name}'. Expected this user's UserAccountControl flag in Active Directory to be a valid integer. Got: [${user_account_control}]. Please consult with your Active Directory admin if you believe this user should be imported.</td>
</tr>
<tr>
    <td>app.&#8203;ad.&#8203;api.&#8203;user_import.&#8203;warn.&#8203;skipped_user.&#8203;missing_required_attribute</td>
    <td>Skipping import of user '${distinguished_name}'. Expected required AD attribute: ${ad_attr_name}, (Okta attribute: ${okta_attr_name}) to not be null. Please consult with your Active Directory admin if you believe this user should be imported.</td>
</tr>
<tr>
    <td>app.&#8203;ad.&#8203;api.&#8203;user_import.&#8203;warn.&#8203;skipped_user.&#8203;attribute_too_long</td>
    <td>Skipping import of user '${distinguished_name}'. AD attribute: ${ad_attr_name}, (Okta attribute: ${okta_attr_name}) with the value of ${ad_attr_value} was too long to be saved. Please consult with your Active Directory admin if you believe this user should be imported.</td>
</tr>
<tr>
    <td>app.&#8203;ad.&#8203;api.&#8203;user_import.&#8203;warn.&#8203;skipped_user.&#8203;internal_object.&#8203;unknown_user</td>
    <td>Skipping the import of AD user with unknown username because their account has attribute "iscriticalsystemobject" = true. Please consult with your Active Directory admin if you believe this user should be imported.</td>
</tr>
<tr>
    <td>app.&#8203;ad.&#8203;api.&#8203;user_import.&#8203;warn.&#8203;skipped_user.&#8203;invalid_user_account_control.&#8203;unknown_user</td>
    <td>Skipping import of AD user with unknown username. Expected this user's UserAccountControl flag in Active Directory to be a valid integer. Got: [${user_account_control}]. Please consult with your Active Directory admin if you believe this user should be imported.</td>
</tr>
<tr>
    <td>app.&#8203;ad.&#8203;api.&#8203;user_import.&#8203;warn.&#8203;skipped_user.&#8203;missing_required_attribute.&#8203;unknown_user</td>
    <td>Skipping import of AD user with unknown username. Expected required AD attribute: ${ad_attr_name}, (Okta attribute: ${okta_attr_name}) to not be null. Please consult with your Active Directory admin if you believe this user should be imported.</td>
</tr>
<tr>
    <td>app.&#8203;ad.&#8203;api.&#8203;user_import.&#8203;warn.&#8203;skipped_ou.&#8203;missing_required_attribute</td>
    <td>Skipping the import of OU with missing attributes: DN: ${ou_attr_dn}, GUID: ${ou_attr_guid}, Name: ${ou_attr_name}</td>
</tr>
<tr>
    <td>app.&#8203;ad.&#8203;outbound.&#8203;delauth.&#8203;no_connected_agent</td>
    <td>Delegated authentication request for user: ${app_username} in app ${app_name} was not processed. No agents are connected to Okta.</td>
</tr>
<tr>
    <td>app.&#8203;ad.&#8203;outbound.&#8203;delauth.&#8203;timeout</td>
    <td>Delegated authentication request for user: ${app_username} in app ${app_name} timed out. Ensure that the agent for your directory is connected to Okta.</td>
</tr>
<tr>
    <td>app.&#8203;ad.&#8203;login.&#8203;success</td>
    <td>Active Directory authentication succeeded</td>
</tr>
<tr>
    <td>app.&#8203;ad.&#8203;login.&#8203;bad_password</td>
    <td>Active Directory authentication failed: bad username or password</td>
</tr>
<tr>
    <td>app.&#8203;ad.&#8203;login.&#8203;expired_password</td>
    <td>Active Directory authentication failed: password has expired (${app_error_code})</td>
</tr>
<tr>
    <td>app.&#8203;ad.&#8203;login.&#8203;locked_account</td>
    <td>Active Directory authentication failed: account is locked (${app_error_code})</td>
</tr>
<tr>
    <td>app.&#8203;ad.&#8203;login.&#8203;unknown_failure</td>
    <td>Active Directory authentication failed for unknown reasons: (${app_error_code})</td>
</tr>
<tr>
    <td>app.&#8203;ad.&#8203;password.&#8203;reset.&#8203;unlock-failed</td>
    <td>Active Directory failed to reset accountLockTime for User: ${app_username}, check the permissions on the service account</td>
</tr>
<tr>
    <td>app.&#8203;ad.&#8203;password.&#8203;reset.&#8203;success</td>
    <td>Active Directory password reset was successful for User : ${app_username}.</td>
</tr>
<tr>
    <td>app.&#8203;ad.&#8203;password.&#8203;reset.&#8203;failure</td>
    <td>Active Directory failed to reset password for User : ${app_username}.</td>
</tr>
<tr>
    <td>app.&#8203;ad.&#8203;user.&#8203;account.&#8203;unlock.&#8203;failure</td>
    <td>Active Directory user account unlock failed for user : ${app_username}.</td>
</tr>
<tr>
    <td>app.&#8203;ad.&#8203;user.&#8203;account.&#8203;unlock.&#8203;success</td>
    <td>Active Directory user account unlock succeeded for user : ${app_username}.</td>
</tr>
</tbody></table>

#### Agent

<table style="table-layout-fixed table-layout-fixed-events">
    
    <col width="377px" />
    <col width="309px" />
    <thead>
        <tr>
            <th>ObjectType</th>
            <th>Description</th>
        </tr>
    </thead>
<tbody>
<tr>
    <td>app.&#8203;ad.&#8203;config.&#8203;agent.&#8203;agent_created</td>
    <td>Active Directory agent ${agent_name} created</td>
</tr>
<tr>
    <td>app.&#8203;ad.&#8203;config.&#8203;agent.&#8203;agent_deactivated</td>
    <td>Active Directory agent ${agent_name} deactivated</td>
</tr>
<tr>
    <td>app.&#8203;ad.&#8203;config.&#8203;agent.&#8203;agent_reactivated</td>
    <td>Active Directory agent ${agent_name} reactivated</td>
</tr>
<tr>
    <td>app.&#8203;ad.&#8203;config.&#8203;agent.&#8203;agent_reactivate_failed_missing_token</td>
    <td>Cannot reactivate the Active Directory agent ${agent_name} because the token has been removed. You must delete and re-install the agent.</td>
</tr>
<tr>
    <td>app.&#8203;ad.&#8203;config.&#8203;agent.&#8203;agent_deleted</td>
    <td>Active Directory agent ${agent_name} deleted</td>
</tr>
<tr>
    <td>app.&#8203;ad.&#8203;agent.&#8203;disconnected</td>
    <td>Active Directory agent ${agent_name} stopped connecting to Okta</td>
</tr>
<tr>
    <td>app.&#8203;ad.&#8203;agent.&#8203;reconnected</td>
    <td>Active Directory agent ${agent_name} reconnected to Okta</td>
</tr>
<tr>
    <td>app.&#8203;ad.&#8203;agent.&#8203;start</td>
    <td>Directory agent ${agent_name} started</td>
</tr>
<tr>
    <td>app.&#8203;ad.&#8203;agent.&#8203;start.&#8203;error</td>
    <td>Directory agent ${agent_name} failed to start with error: ${agent_error_message}</td>
</tr>
<tr>
    <td>app.&#8203;ad.&#8203;agent.&#8203;config</td>
    <td>Directory agent ${agent_name} updated its configuration</td>
</tr>
<tr>
    <td>app.&#8203;ad.&#8203;agent.&#8203;config.&#8203;error</td>
    <td>Directory agent ${agent_name} encountered a configuration error: ${agent_error_message}</td>
</tr>
<tr>
    <td>app.&#8203;ad.&#8203;agent.&#8203;scan</td>
    <td>Directory agent ${agent_name} performed an import</td>
</tr>
<tr>
    <td>app.&#8203;ad.&#8203;agent.&#8203;scan.&#8203;error</td>
    <td>Directory agent ${agent_name} encountered an import error: ${agent_error_message}</td>
</tr>
<tr>
    <td>app.&#8203;ad.&#8203;agent.&#8203;upgrade</td>
    <td>Directory agent ${agent_name} upgraded</td>
</tr>
<tr>
    <td>app.&#8203;ad.&#8203;agent.&#8203;upgrade.&#8203;error</td>
    <td>Directory agent ${agent_name} upgraded</td>
</tr>
<tr>
    <td>app.&#8203;ad.&#8203;agent.&#8203;user_auth</td>
    <td>User Auth Success. Agent: ${agent_name}.</td>
</tr>
<tr>
    <td>app.&#8203;ad.&#8203;agent.&#8203;user_auth.&#8203;error</td>
    <td>User Auth Failure. Agent ${agent_name}. Message: ${agent_error_message}</td>
</tr>
<tr>
    <td>app.&#8203;ad.&#8203;agent.&#8203;dir-invoke</td>
    <td>Directory agent ${agent_name} performed a Directory Invoke command</td>
</tr>
<tr>
    <td>app.&#8203;ad.&#8203;agent.&#8203;dir-invoke.&#8203;error</td>
    <td>Directory agent ${agent_name} encountered an error performing a Directory Invoke: ${agent_error_message}</td>
</tr>
<tr>
    <td>app.&#8203;ad.&#8203;agent.&#8203;read-ldap</td>
    <td>Directory agent ${agent_name} performed an LDAP Read</td>
</tr>
<tr>
    <td>app.&#8203;ad.&#8203;agent.&#8203;read-ldap.&#8203;error</td>
    <td>Directory agent ${agent_name} encountered an error performing an LDAP Read: ${agent_error_message}</td>
</tr>
<tr>
    <td>app.&#8203;ad.&#8203;agent.&#8203;user-auth-and-update</td>
    <td>User Auth and Update Success. Agent: ${agent_name}.</td>
</tr>
<tr>
    <td>app.&#8203;ad.&#8203;agent.&#8203;user-auth-and-update.&#8203;error</td>
    <td>Directory Agent ${agent_name} encountered an error performing a User Auth and Update action: ${agent_error_message}</td>
</tr>
<tr>
    <td>app.&#8203;ad.&#8203;agent.&#8203;write-ldap</td>
    <td>Directory agent ${agent_name} performed an LDAP Write</td>
</tr>
<tr>
    <td>app.&#8203;ad.&#8203;agent.&#8203;write-ldap.&#8203;error</td>
    <td>Directory agent ${agent_name} encountered an error performing an LDAP Write: ${agent_error_message}</td>
</tr>
<tr>
    <td>app.&#8203;ad.&#8203;agent.&#8203;real-time-sync</td>
    <td>Directory RealTimeSync Success. Agent: ${agent_name}.</td>
</tr>
<tr>
    <td>app.&#8203;ad.&#8203;agent.&#8203;real-time-sync.&#8203;error</td>
    <td>Directory Agent ${agent_name} encountered an error performing a RealTimeSync action: ${agent_error_message}</td>
</tr>
<tr>
    <td>app.&#8203;ad.&#8203;agent.&#8203;modify-config</td>
    <td>Directory agent ${agent_name} had its configuration modified.</td>
</tr>
<tr>
    <td>app.&#8203;ad.&#8203;agent.&#8203;modify-config.&#8203;error</td>
    <td>Directory Agent ${agent_name} encountered an error performing a ModifyConfig action: ${agent_error_message}</td>
</tr>
<tr>
    <td>app.&#8203;ad.&#8203;agent.&#8203;read-config</td>
    <td>Directory agent ${agent_name} had its configuration read.</td>
</tr>
<tr>
    <td>app.&#8203;ad.&#8203;agent.&#8203;read-config.&#8203;error</td>
    <td>Directory Agent ${agent_name} encountered an error performing a ReadConfig action: ${agent_error_message}</td>
</tr>
<tr>
    <td>app.&#8203;ad.&#8203;agent.&#8203;fetch-logs</td>
    <td>Directory agent ${agent_name} had logs uploaded.</td>
</tr>
<tr>
    <td>app.&#8203;ad.&#8203;agent.&#8203;fetch-logs.&#8203;error</td>
    <td>Directory Agent ${agent_name} encountered an error performing a FetchLogs action: ${agent_error_message}</td>
</tr>
<tr>
    <td>app.&#8203;ad.&#8203;agent.&#8203;read-schema</td>
    <td>Directory agent ${agent_name} performed schema read operation;</td>
</tr>
<tr>
    <td>app.&#8203;ad.&#8203;agent.&#8203;read-schema.&#8203;error</td>
    <td>Directory agent ${agent_name} encountered an error performing schema read: ${agent_error_message};</td>
</tr>
<tr>
    <td>app.&#8203;ad.&#8203;agent.&#8203;read-forest-topology</td>
    <td>Directory agent ${agent_name} performed topology import operation;</td>
</tr>
<tr>
    <td>app.&#8203;ad.&#8203;agent.&#8203;read-forest-topology.&#8203;error</td>
    <td>Directory agent ${agent_name} encountered an error performing topology import operation: ${agent_error_message};</td>
</tr>
<tr>
    <td>app.&#8203;ad.&#8203;agent.&#8203;read-dirsync</td>
    <td>Directory agent ${agent_name} performed dirsync operation;</td>
</tr>
<tr>
    <td>app.&#8203;ad.&#8203;agent.&#8203;read-dirsync.&#8203;error</td>
    <td>Directory agent ${agent_name} encountered an error performing dirsync: ${agent_error_message};</td>
</tr>
<tr>
    <td>app.&#8203;ad.&#8203;group.&#8203;provision.&#8203;create.&#8203;error</td>
    <td>Error provisioning AD group: {0}</td>
</tr>
<tr>
    <td>app.&#8203;ad.&#8203;group.&#8203;provision.&#8203;modify.&#8203;error</td>
    <td>Error updating AD group: {0}</td>
</tr>
<tr>
    <td>app.&#8203;ad.&#8203;group.&#8203;provision.&#8203;delete.&#8203;error</td>
    <td>Error deleting AD group: {0}</td>
</tr>
<tr>
    <td>app.&#8203;ad.&#8203;group.&#8203;provision.&#8203;updateMembershipError</td>
    <td>Error ''{2}'' updating group membership for group={0} in directory {1}.</td>
</tr>
<tr>
    <td>agents.&#8203;connector_agent.&#8203;agent_reconnected</td>
    <td>Agent ${agent_id} (${agent_name}) reconnected to Okta</td>
</tr>
<tr>
    <td>agents.&#8203;connector_agent.&#8203;agent_disconnected</td>
    <td>Agent ${agent_id} (${agent_name}) stopped connecting to Okta</td>
</tr>
<tr>
    <td>agents.&#8203;connector_agent.&#8203;agent_deactivated</td>
    <td>Agent ${agent_id} (${agent_name}) deactivated</td>
</tr>
<tr>
    <td>agents.&#8203;connector_agent.&#8203;agent_reactivated</td>
    <td>Agent ${agent_id} (${agent_name}) reactivated</td>
</tr>
<tr>
    <td>agents.&#8203;connector_agent.&#8203;agent_deleted</td>
    <td>Agent ${agent_id} (${agent_name}) deleted</td>
</tr>
<tr>
    <td>agents.&#8203;connector_agent.&#8203;agent_reactivate_failed_missing_token</td>
    <td>Cannot reactivate the agent ${agent_id} (${agent_name}) because the token has been removed. You must delete and re-install the agent.</td>
</tr>
</tbody></table>

### LDAP

<table style="table-layout-fixed table-layout-fixed-events">
    
    <col width="377px" />
    <col width="309px" />
    <thead>
        <tr>
            <th>ObjectType</th>
            <th>Description</th>
        </tr>
    </thead>
<tbody>
<tr>
    <td>app.&#8203;ldap.&#8203;login.&#8203;success</td>
    <td>LDAP authentication succeeded</td>
</tr>
<tr>
    <td>app.&#8203;ldap.&#8203;login.&#8203;bad_password</td>
    <td>LDAP authentication failed: bad username or password</td>
</tr>
<tr>
    <td>app.&#8203;ldap.&#8203;login.&#8203;expired_password</td>
    <td>LDAP authentication failed: password has expired (${app_error_code})</td>
</tr>
<tr>
    <td>app.&#8203;ldap.&#8203;login.&#8203;locked_account</td>
    <td>LDAP authentication failed: account is locked (${app_error_code})</td>
</tr>
<tr>
    <td>app.&#8203;ldap.&#8203;login.&#8203;disabled_account</td>
    <td>LDAP authentication failed: account is disabled (${app_error_code})</td>
</tr>
<tr>
    <td>app.&#8203;ldap.&#8203;login.&#8203;unknown_failure</td>
    <td>LDAP authentication failed for unknown reasons: (${app_error_code})</td>
</tr>
<tr>
    <td>app.&#8203;ldap.&#8203;jit.&#8203;ambiguous</td>
    <td>JIT failed due to ambiguous name for User: ${app_error_code}, ensure that only one directory refers to this User</td>
</tr>
<tr>
    <td>app.&#8203;ldap.&#8203;agent.&#8203;password_reset</td>
    <td>LDAP agent ${agent_name} performed a password reset</td>
</tr>
<tr>
    <td>app.&#8203;ldap.&#8203;agent.&#8203;password_reset.&#8203;error</td>
    <td>LDAP agent ${agent_name} failed to performed a password reset</td>
</tr>
<tr>
    <td>app.&#8203;ldap.&#8203;agent.&#8203;password_reset.&#8203;timeout</td>
    <td>LDAP agent ${agent_name} password reset timed out</td>
</tr>
<tr>
    <td>app.&#8203;ldap.&#8203;agent.&#8203;password_change.&#8203;timeout</td>
    <td>LDAP agent ${agent_name} password change timed out</td>
</tr>
<tr>
    <td>app.&#8203;ldap.&#8203;agent.&#8203;password_change</td>
    <td>LDAP agent ${agent_name} performed a password change</td>
</tr>
<tr>
    <td>app.&#8203;ldap.&#8203;agent.&#8203;password_update</td>
    <td>LDAP agent ${agent_name} performed a password update</td>
</tr>
<tr>
    <td>app.&#8203;ldap.&#8203;agent.&#8203;password_update.&#8203;error</td>
    <td>LDAP agent ${agent_name} failed to perform a password update</td>
</tr>
<tr>
    <td>app.&#8203;ldap.&#8203;password.&#8203;reset.&#8203;timeout</td>
    <td>LDAP agent failed to reset password due to timeout.</td>
</tr>
<tr>
    <td>app.&#8203;ldap.&#8203;password.&#8203;reset.&#8203;succeeded</td>
    <td>Password reset succeeded.</td>
</tr>
<tr>
    <td>app.&#8203;ldap.&#8203;password.&#8203;reset.&#8203;failed</td>
    <td>Password reset failed.</td>
</tr>
<tr>
    <td>app.&#8203;ldap.&#8203;password.&#8203;reset.&#8203;systemic.&#8203;error</td>
    <td>LDAP agent failed to reset password due to systemic error.</td>
</tr>
<tr>
    <td>app.&#8203;ldap.&#8203;password.&#8203;reset.&#8203;constraint.&#8203;error</td>
    <td>LDAP agent failed to reset password because of password policy violation.</td>
</tr>
<tr>
    <td>app.&#8203;ldap.&#8203;password.&#8203;reset.&#8203;invalid.&#8203;old.&#8203;password</td>
    <td>LDAP agent failed to reset password because old password is invalid.</td>
</tr>
<tr>
    <td>app.&#8203;ldap.&#8203;password_reset.&#8203;old_new_passwords_equal</td>
    <td>Failed to reset password because old and new password are equal.</td>
</tr>
<tr>
    <td>app.&#8203;ldap.&#8203;password_reset.&#8203;old_password_empty</td>
    <td>Failed to reset password because old password is empty.</td>
</tr>
<tr>
    <td>app.&#8203;ldap.&#8203;password_reset.&#8203;new_password_empty</td>
    <td>Failed to reset password because new password is empty.</td>
</tr>
<tr>
    <td>app.&#8203;ldap.&#8203;password_reset.&#8203;new_confirm_password_empty</td>
    <td>Failed to reset password because repeated password is empty.</td>
</tr>
<tr>
    <td>app.&#8203;ldap.&#8203;password_reset.&#8203;passwords_do_not_match</td>
    <td>Failed to reset password because passwords are not match.</td>
</tr>
<tr>
    <td>app.&#8203;ldap.&#8203;password_reset.&#8203;attribs_not_set</td>
    <td>LDAP agent failed to reset password because password attribute is not set.</td>
</tr>
<tr>
    <td>app.&#8203;ldap.&#8203;password_reset.&#8203;restriction.&#8203;error</td>
    <td>LDAP agent failed to reset password because of restriction error.</td>
</tr>
<tr>
    <td>app.&#8203;ldap.&#8203;password.&#8203;change.&#8203;timeout</td>
    <td>Unable to change your password at this time. Please try again or contact your administrator.</td>
</tr>
<tr>
    <td>app.&#8203;ldap.&#8203;password.&#8203;change.&#8203;systemic.&#8203;error</td>
    <td>Unable to change your password at this time.  Please try again or contact your administrator.</td>
</tr>
<tr>
    <td>app.&#8203;ldap.&#8203;password.&#8203;change.&#8203;succeeded</td>
    <td>Password reset succeeded.</td>
</tr>
</tbody></table>

### IWA

<table style="table-layout-fixed table-layout-fixed-events">
    
    <col width="377px" />
    <col width="309px" />
    <thead>
        <tr>
            <th>ObjectType</th>
            <th>Description</th>
        </tr>
    </thead>
<tbody>
<tr>
    <td>iwa.&#8203;ping</td>
    <td>IWA Ping Action Received</td>
</tr>
<tr>
    <td>iwa.&#8203;ping.&#8203;error</td>
    <td>Failed to ping IWA agent: ${error_message}</td>
</tr>
<tr>
    <td>iwa.&#8203;invalid_certificate</td>
    <td>Invalid IWA SSO certificate</td>
</tr>
<tr>
    <td>iwa.&#8203;no_certificate</td>
    <td>No IWA SSO certificate provided from user: ${app_username}</td>
</tr>
<tr>
    <td>iwa.&#8203;invalid_token</td>
    <td>Invalid IWA SSO redirect token</td>
</tr>
<tr>
    <td>iwa.&#8203;invalid_xml_signature</td>
    <td>Invalid IWA XML signature from user: ${app_username}</td>
</tr>
<tr>
    <td>iwa.&#8203;ip_not_in_range</td>
    <td>IWA agent's IP is not in the range of allowed IP addresses. User tried to log in: ${app_username}</td>
</tr>
<tr>
    <td>iwa.&#8203;created_successfully</td>
    <td>Created IWA agent with redirect url: ${iwa_url} and version: ${iwa_version}</td>
</tr>
<tr>
    <td>iwa.&#8203;creating_failed</td>
    <td>Failed creating IWA agent with redirect url: ${iwa_url} and version: ${iwa_version}</td>
</tr>
<tr>
    <td>iwa.&#8203;updated_successfully</td>
    <td>Updated IWA agent: ${iwa_name}. ${iwa_custom_msg}</td>
</tr>
<tr>
    <td>iwa.&#8203;updating_failed</td>
    <td>Failed to update IWA agent ${iwa_name}. Error message: ${iwa_custom_msg}</td>
</tr>
<tr>
    <td>iwa.&#8203;removed</td>
    <td>Removed IWA agent ${iwa_name}</td>
</tr>
<tr>
    <td>iwa.&#8203;disabled</td>
    <td>Disabled IWA agent ${iwa_name}</td>
</tr>
<tr>
    <td>iwa.&#8203;login_attempt_from_unknown_ip</td>
    <td>Tried to login using IWA SSO from unknown IP: ${iwa_custom_msg}</td>
</tr>
<tr>
    <td>iwa.&#8203;primary_not_found</td>
    <td>No primary IWA app was found. Using default login page</td>
</tr>
<tr>
    <td>iwa.&#8203;auth</td>
    <td>IWA authentication result: ${iwa_custom_msg}</td>
</tr>
<tr>
    <td>iwa.&#8203;went_offline</td>
    <td>IWA agent ${iwa_custom_msg} went offline</td>
</tr>
<tr>
    <td>iwa.&#8203;went_online</td>
    <td>IWA agent ${iwa_custom_msg} is back to live. Setting it to backup</td>
</tr>
<tr>
    <td>iwa.&#8203;promoted_to_primary</td>
    <td>No primary IWA was found. Promoting backup ${iwa_custom_msg} to primary</td>
</tr>
<tr>
    <td>iwa.&#8203;ad_agents_went_offline</td>
    <td>IWA agent ${iwa_name} could not be verified because no active AD Agent available</td>
</tr>
<tr>
    <td>iwa.&#8203;no_agents_promoted_to_primary</td>
    <td>There is no primary IWA agent. Unable to find a backup IWA agent to promote to primary.</td>
</tr>
<tr>
    <td>iwa.&#8203;custom</td>
    <td>${iwa_custom_msg}</td>
</tr>
</tbody></table>

### SAML

<table style="table-layout-fixed table-layout-fixed-events">
    
    <col width="377px" />
    <col width="309px" />
    <thead>
        <tr>
            <th>ObjectType</th>
            <th>Description</th>
        </tr>
    </thead>
<tbody>
<tr>
    <td>core.&#8203;user_auth.&#8203;saml2.&#8203;inbound_saml_login_failed</td>
    <td>Inbound SAML login failed with message: ${message}</td>
</tr>
<tr>
    <td>core.&#8203;user_auth.&#8203;saml2.&#8203;user_create_failed</td>
    <td>Inbound SAML user creation failed for user: ${login}</td>
</tr>
<tr>
    <td>core.&#8203;user_auth.&#8203;idp.&#8203;saml.&#8203;login_success</td>
    <td>Sign-in successful for federated login via SAML assertion: [${token_id}] with AMR: [${saml_amr}]</td>
</tr>
<tr>
    <td>core.&#8203;user_auth.&#8203;idp.&#8203;saml.&#8203;unknown_endpoint</td>
    <td>Unable to resolve IdP endpoint '${instance_id}'. Ensure the IdP is configured with a valid ACS URL.</td>
</tr>
<tr>
    <td>core.&#8203;user_auth.&#8203;idp.&#8203;saml.&#8203;assertion_validation_failed</td>
    <td>Unable to validate incoming SAML Assertion: [${token_id}] - ${error_message}</td>
</tr>
<tr>
    <td>core.&#8203;user_auth.&#8203;idp.&#8203;username_transform_failed</td>
    <td>Unable to transform incoming subject '${subject_name}' to username - ${error_message}</td>
</tr>
<tr>
    <td>core.&#8203;user_auth.&#8203;idp.&#8203;username_filtered</td>
    <td>The transformed username '${okta_username}' was rejected by the username filter.</td>
</tr>
<tr>
    <td>core.&#8203;user_auth.&#8203;idp.&#8203;no_matching_users</td>
    <td>Unable to match transformed username '${okta_username}' to an existing Okta User.</td>
</tr>
<tr>
    <td>core.&#8203;user_auth.&#8203;idp.&#8203;multiple_matching_users</td>
    <td>Unable to match transformed username '${okta_username}' to an existing Okta User because multiple Okta Users were found.</td>
</tr>
<tr>
    <td>core.&#8203;user_auth.&#8203;idp.&#8203;invalid_user_status</td>
    <td>Unable to authenticate '${okta_username}' because the matched user has an invalid status (${user_status}).</td>
</tr>
<tr>
    <td>core.&#8203;user_auth.&#8203;idp.&#8203;attribute_schema_error</td>
    <td>Unable to process attribute '${attribute_name}' for incoming subject '${subject_name}': ${error_message}</td>
</tr>
<tr>
    <td>core.&#8203;user_auth.&#8203;idp.&#8203;cannot_update_profile</td>
    <td>Cannot update profile attributes for '${okta_username}' because the system is in ${server_status} mode.</td>
</tr>
<tr>
    <td>core.&#8203;user_auth.&#8203;idp.&#8203;login_failed</td>
    <td>Sign-in failed for federated login '${okta_username}' - ${reason_code}</td>
</tr>
<tr>
    <td>auth.&#8203;error_reason.&#8203;jit_failed</td>
    <td>Unable To JIT</td>
</tr>
<tr>
    <td>auth.&#8203;error_reason.&#8203;unable_to_perform</td>
    <td>Unable To Perform</td>
</tr>
<tr>
    <td>auth.&#8203;error_reason.&#8203;request_time_out</td>
    <td>Time Out</td>
</tr>
<tr>
    <td>auth.&#8203;error_reason.&#8203;too_many_attempts</td>
    <td>Too Many Attempts</td>
</tr>
<tr>
    <td>auth.&#8203;error_reason.&#8203;user_not_found</td>
    <td>User Not Found</td>
</tr>
<tr>
    <td>auth.&#8203;error_reason.&#8203;user_denied</td>
    <td>User Denied/Rejected</td>
</tr>
<tr>
    <td>auth.&#8203;error_reason.&#8203;invalid_user_status</td>
    <td>Invalid User Status</td>
</tr>
<tr>
    <td>auth.&#8203;error_reason.&#8203;invalid_credential</td>
    <td>Invalid Credential</td>
</tr>
</tbody></table>
