<?php

namespace App\Security\Voter;

use App\Entity\Account;
use phpDocumentor\Reflection\Types\Self_;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;
use Symfony\Component\Security\Core\User\UserInterface;

class AccountVoter extends Voter
{
    public function __construct(
        private readonly Security $security
    )
    {
    }

    public const SHOW = 'ACCOUNT_SHOW';
    public const DELETE = 'ACCOUNT_DELETE';
    public const EDIT = 'ACCOUNT_EDIT';
    public const EDIT_ROLES = 'EDIT_ROLES';
    public const UPLOAD = 'ACCOUNT_UPLOAD';
    public const MANAGE_MEDIEN = 'MANAGE_MEDIEN';
    public const MANAGE_API = 'MANAGE_API';
    public const EDIT_GRANTS = 'EDIT_GRANTS';
    public const ADD_ACCOUNT = 'ADD_ACCOUNT';
    public const MANAGE_ACCOUNT = 'MANAGE_ACCOUNT';
    public const MANAGE_AUTHORISATION = 'MANAGE_AUTHORISATION';
    public const MANAGE_ACTIVITY = 'MANAGE_ACTIVITY';
    public const MANAGE_EMAIL = 'MANAGE_EMAIL';
    public const ACCOUNT_EMAIL = 'ACCOUNT_EMAIL';
    public const SEND_EMAIL = 'SEND_EMAIL';
    public const MANAGE_REGISTRATION = 'MANAGE_REGISTRATION';
    public const MANAGE_ACTIVATION = 'MANAGE_ACTIVATION';
    public const MANAGE_BACKUP = 'MANAGE_BACKUP';
    public const ADD_BACKUP = 'ADD_BACKUP';
    public const MANAGE_OAUTH = 'MANAGE_OAUTH';
    public const MANAGE_SYSTEM_SETTINGS = 'MANAGE_SYSTEM_SETTINGS';
    public const MANAGE_LOG = 'MANAGE_LOG';
    public const MANAGE_APP_SETTINGS = 'MANAGE_APP_SETTINGS';
    public const MANAGE_EMAIL_SETTINGS = 'MANAGE_EMAIL_SETTINGS';
    public const MEDIEN_CONVERTER = 'MEDIEN_CONVERTER';
    public const MANAGE_PAGE = 'MANAGE_PAGE';
    public const MANAGE_PAGE_SEO = 'MANAGE_PAGE_SEO';
    public const MANAGE_PAGE_SITES = 'MANAGE_PAGE_SITES';
    public const MANAGE_PAGE_CATEGORY = 'MANAGE_PAGE_CATEGORY';
    public const MANAGE_SITE_BUILDER = 'MANAGE_SITE_BUILDER';
    public const MANAGE_BUILDER_SITES = 'MANAGE_BUILDER_SITES';
    public const MANAGE_BUILDER_PLUGINS = 'MANAGE_BUILDER_PLUGINS';
    public const MEDIEN_SLIDER = 'MEDIEN_SLIDER';
    public const MEDIEN_CAROUSEL = 'MEDIEN_CAROUSEL';
    public const MEDIEN_GALLERY = 'MEDIEN_GALLERY';
    public const MANAGE_GALLERY_SLIDER = 'MANAGE_GALLERY_SLIDER';
    public const MANAGE_MENU = 'MANAGE_MENU';
    public const ADD_MENU = 'ADD_MENU';
    public const MANAGE_POST = 'MANAGE_POST';
    public const ADD_POST = 'ADD_POST';
    public const POST_CATEGORY_DESIGN = 'POST_CATEGORY_DESIGN';
    public const POST_DESIGN = 'POST_DESIGN';
    public const POST_LOOP_DESIGN = 'POST_LOOP_DESIGN';
    public const DELETE_POST = 'DELETE_POST';
    public const DELETE_POST_CATEGORY = 'DELETE_POST_CATEGORY';
    public const MANAGE_SCSS_COMPILER = 'MANAGE_SCSS_COMPILER';
    public const MANAGE_FONTS = 'MANAGE_FONTS';
    public const DELETE_FONTS = 'DELETE_FONTS';
    public const MANAGE_DESIGN = 'MANAGE_DESIGN';
    public const MANAGE_DESIGN_SETTINGS = 'MANAGE_DESIGN_SETTINGS';
    public const MANAGE_HEADER = 'MANAGE_HEADER';
    public const MANAGE_FOOTER = 'MANAGE_FOOTER';
    public const MANAGE_TOOLS = 'MANAGE_TOOLS';
    public const MANAGE_MAPS_PROTECTION = 'MANAGE_MAPS_PROTECTION';
    public const MANAGE_FORMS = 'MANAGE_FORMS';
    public const ADD_FORMS = 'ADD_FORMS';
    public const DELETE_FORMS = 'DELETE_FORMS';
    public const MANAGE_CONSUMER = 'MANAGE_CONSUMER';
    public const MANAGE_CUSTOM_FIELDS = 'MANAGE_CUSTOM_FIELDS';

    protected function supports(string $attribute, mixed $subject): bool
    {
        // replace with your own logic
        // https://symfony.com/doc/current/security/voters.html
        return in_array($attribute, [
                self::SHOW,
                self::DELETE,
                self::EDIT,
                self::EDIT_ROLES,
                self::UPLOAD,
                self::ADD_ACCOUNT,
                self::MANAGE_MEDIEN,
                self::MANAGE_API,
                self::MANAGE_ACCOUNT,
                self::MANAGE_AUTHORISATION,
                self::MANAGE_ACTIVITY,
                self::MANAGE_EMAIL,
                self::MANAGE_REGISTRATION,
                self::MANAGE_ACTIVATION,
                self::EDIT_GRANTS,
                self::MANAGE_BACKUP,
                self::ADD_BACKUP,
                self::MANAGE_OAUTH,
                self::MANAGE_SYSTEM_SETTINGS,
                self::MANAGE_LOG,
                self::MANAGE_APP_SETTINGS,
                self::SEND_EMAIL,
                self::MANAGE_EMAIL_SETTINGS,
                self::MEDIEN_CONVERTER,
                self::ACCOUNT_EMAIL,
                self::MANAGE_PAGE,
                self::MANAGE_PAGE_SEO,
                self::MANAGE_PAGE_SITES,
                self::MANAGE_PAGE_CATEGORY,
                self::MANAGE_SITE_BUILDER,
                self::MANAGE_BUILDER_SITES,
                self::MANAGE_BUILDER_PLUGINS,
                self::MEDIEN_SLIDER,
                self::MEDIEN_CAROUSEL,
                self::MEDIEN_GALLERY,
                self::MANAGE_GALLERY_SLIDER,
                self::MANAGE_MENU,
                self::ADD_MENU,
                self::MANAGE_POST,
                self::ADD_POST,
                self::POST_CATEGORY_DESIGN,
                self::POST_DESIGN,
                self::POST_LOOP_DESIGN,
                self::DELETE_POST,
                self::DELETE_POST_CATEGORY,
                self::MANAGE_SCSS_COMPILER,
                self::MANAGE_DESIGN,
                self::MANAGE_FONTS,
                self::DELETE_FONTS,
                self::MANAGE_DESIGN_SETTINGS,
                self::MANAGE_HEADER,
                self::MANAGE_FOOTER,
                self::MANAGE_TOOLS,
                self::MANAGE_MAPS_PROTECTION,
                self::MANAGE_FORMS,
                self::ADD_FORMS,
                self::DELETE_FORMS,
                self::MANAGE_CONSUMER,
                self::MANAGE_CUSTOM_FIELDS
            ])
            && $subject instanceof Account;
    }

    protected function voteOnAttribute(string $attribute, mixed $subject, TokenInterface $token): bool
    {
        $user = $token->getUser();
        // if the user is anonymous, do not grant access
        if (!$user instanceof UserInterface) {
            return false;
        }

        // ... (check conditions and return true to grant permission) ...
        return match ($attribute) {
            self::SHOW => $this->show($subject, $user),
            self::EDIT => $this->edit($subject, $user),
            self::DELETE => $this->account_delete($subject, $user),
            self::EDIT_ROLES => $this->edit_roles($subject, $user),
            self::UPLOAD => $this->upload($subject, $user),
            self::ADD_ACCOUNT => $this->add_account($subject, $user),
            self::MANAGE_MEDIEN => $this->manage_medien($subject, $user),
            self::MANAGE_API => $this->manage_api($subject, $user),
            self::MANAGE_ACCOUNT => $this->manage_account($subject, $user),
            self::MANAGE_AUTHORISATION => $this->manage_authorisation($subject, $user),
            self::MANAGE_ACTIVITY => $this->manage_activity($subject, $user),
            self::MANAGE_EMAIL => $this->manage_email($subject, $user),
            self::SEND_EMAIL => $this->send_email($subject, $user),
            self::MANAGE_EMAIL_SETTINGS => $this->manage_email_system($subject, $user),
            self::MANAGE_REGISTRATION => $this->manage_registration($subject, $user),
            self::MANAGE_ACTIVATION => $this->manage_activation($subject, $user),
            self::EDIT_GRANTS => $this->edit_grants($subject, $user),
            self::MANAGE_BACKUP => $this->manage_backup($subject, $user),
            self::ADD_BACKUP => $this->add_backup($subject, $user),
            self::MANAGE_OAUTH => $this->manage_oauth($subject, $user),
            self::MANAGE_SYSTEM_SETTINGS => $this->manage_system_settings($subject, $user),
            self::MANAGE_LOG => $this->manage_log($subject, $user),
            self::MANAGE_APP_SETTINGS => $this->manage_app_settings($subject, $user),
            self::MEDIEN_CONVERTER => $this->medien_converter($subject, $user),
            self::ACCOUNT_EMAIL => $this->account_email($subject, $user),
            self::MANAGE_PAGE => $this->manage_page($subject, $user),
            self::MANAGE_PAGE_SEO => $this->manage_page_seo($subject, $user),
            self::MANAGE_PAGE_SITES => $this->manage_page_sites($subject, $user),
            self::MANAGE_PAGE_CATEGORY => $this->manage_page_category($subject, $user),
            self::MANAGE_SITE_BUILDER => $this->manage_site_builder($subject, $user),
            self::MANAGE_BUILDER_SITES => $this->manage_builder_sites($subject, $user),
            self::MANAGE_BUILDER_PLUGINS => $this->manage_builder_plugins($subject, $user),
            self::MEDIEN_SLIDER => $this->medien_slider($subject, $user),
            self::MEDIEN_CAROUSEL => $this->medien_carousel($subject, $user),
            self::MEDIEN_GALLERY => $this->medien_gallery($subject, $user),
            self::MANAGE_GALLERY_SLIDER => $this->manage_medien_gallery($subject, $user),
            self::MANAGE_MENU => $this->manage_menu($subject, $user),
            self::ADD_MENU => $this->add_menu($subject, $user),
            self::MANAGE_POST => $this->manage_post($subject, $user),
            self::ADD_POST => $this->add_post($subject, $user),
            self::POST_CATEGORY_DESIGN => $this->post_category_design($subject, $user),
            self::POST_DESIGN => $this->post_design($subject, $user),
            self::POST_LOOP_DESIGN => $this->post_loop_design($subject, $user),
            self::DELETE_POST => $this->delete_post($subject, $user),
            self::DELETE_POST_CATEGORY => $this->delete_post_category($subject, $user),
            self::MANAGE_SCSS_COMPILER => $this->manage_scss_compiler($subject, $user),
            self::MANAGE_FONTS => $this->manage_fonts($subject, $user),
            self::DELETE_FONTS => $this->delete_fonts($subject, $user),
            self::MANAGE_DESIGN => $this->manage_design($subject, $user),
            self::MANAGE_DESIGN_SETTINGS => $this->manage_design_settings($subject, $user),
            self::MANAGE_HEADER => $this->manage_header($subject, $user),
            self::MANAGE_FOOTER => $this->manage_footer($subject, $user),
            self::MANAGE_TOOLS => $this->manage_tools($subject, $user),
            self::MANAGE_MAPS_PROTECTION => $this->manage_maps_protection($subject, $user),
            self::MANAGE_FORMS => $this->manage_forms($subject, $user),
            self::ADD_FORMS => $this->add_forms($subject, $user),
            self::DELETE_FORMS => $this->delete_forms($subject, $user),
            self::MANAGE_CONSUMER => $this->manage_consumer($subject, $user),
            self::MANAGE_CUSTOM_FIELDS => $this->manage_custom_fields($subject, $user),
        };
    }

    private function show($account, $user): bool
    {
        return
            $account->isChangePw() && $user->isVerified() ||
            $this->security->isGranted('ROLE_SUPER_ADMIN');
    }

    private function edit($account, $user): bool
    {
        return
            //$account->getAccountHolder() == $user ||
            in_array(self::EDIT, $account->getVoter()) && $user->isVerified() ||
            $this->security->isGranted('ROLE_SUPER_ADMIN');
    }

    private function edit_roles($account, $user): bool
    {
        return
            //$account->getAccountHolder() == $user ||
            in_array(self::EDIT_ROLES, $account->getVoter()) && $user->isVerified() ||
            $this->security->isGranted('ROLE_SUPER_ADMIN');
    }

    private function upload($account, $user): bool
    {
        return
            // $account->getAccountHolder() == $user ||
            in_array(self::UPLOAD, $account->getVoter()) && $user->isVerified() ||
            $this->security->isGranted('ROLE_SUPER_ADMIN');
    }

    private function account_delete($account, $user): bool
    {
        return
            // $account->getAccountHolder() == $user ||
            in_array(self::DELETE, $account->getVoter()) && $user->isVerified() ||
            $this->security->isGranted('ROLE_SUPER_ADMIN');
    }

    private function manage_medien($account, $user): bool
    {
        //  in_array(self::MANAGE_MEDIEN, $account->getVoter());
        return
            //$account->getAccountHolder() == $user ||
            in_array(self::MANAGE_MEDIEN, $account->getVoter()) && $user->isVerified() ||
            $this->security->isGranted('ROLE_SUPER_ADMIN');
    }

    private function manage_api($account, $user): bool
    {
        return
            in_array(self::MANAGE_API, $account->getVoter()) && $user->isVerified() ||
            $this->security->isGranted('ROLE_SUPER_ADMIN');
    }

    private function edit_grants($account, $user): bool
    {
        return
            in_array(self::EDIT_GRANTS, $account->getVoter()) && $user->isVerified() ||
            $this->security->isGranted('ROLE_SUPER_ADMIN');
    }

    private function manage_account($account, $user): bool
    {
        return
            in_array(self::MANAGE_ACCOUNT, $account->getVoter()) && $user->isVerified() ||
            $this->security->isGranted('ROLE_SUPER_ADMIN');
    }

    private function add_account($account, $user): bool
    {
        return
            in_array(self::ADD_ACCOUNT, $account->getVoter()) && $user->isVerified() ||
            $this->security->isGranted('ROLE_SUPER_ADMIN');
    }

    private function manage_authorisation($account, $user): bool
    {
        return
            in_array(self::MANAGE_AUTHORISATION, $account->getVoter()) && $user->isVerified() ||
            $this->security->isGranted('ROLE_SUPER_ADMIN');
    }

    public function manage_activity($account, $user): bool
    {
        return
            in_array(self::MANAGE_ACTIVITY, $account->getVoter()) && $user->isVerified() ||
            $this->security->isGranted('ROLE_SUPER_ADMIN');
    }

    public function manage_registration($account, $user): bool
    {
        return
            in_array(self::MANAGE_REGISTRATION, $account->getVoter()) && $user->isVerified() ||
            $this->security->isGranted('ROLE_SUPER_ADMIN');
    }

    public function manage_activation($account, $user): bool
    {
        return
            in_array(self::MANAGE_ACTIVATION, $account->getVoter()) && $user->isVerified() ||
            $this->security->isGranted('ROLE_SUPER_ADMIN');
    }

    public function manage_backup($account, $user): bool
    {
        return
            in_array(self::MANAGE_BACKUP, $account->getVoter()) && $user->isVerified() ||
            $this->security->isGranted('ROLE_SUPER_ADMIN');
    }

    public function add_backup($account, $user): bool
    {
        return
            in_array(self::ADD_BACKUP, $account->getVoter()) && $user->isVerified() ||
            $this->security->isGranted('ROLE_SUPER_ADMIN');
    }

    public function manage_oauth($account, $user): bool
    {
        return
            in_array(self::MANAGE_OAUTH, $account->getVoter()) && $user->isVerified() ||
            $this->security->isGranted('ROLE_SUPER_ADMIN');
    }

    public function manage_system_settings($account, $user): bool
    {
        return
            in_array(self::MANAGE_SYSTEM_SETTINGS, $account->getVoter()) && $user->isVerified() ||
            $this->security->isGranted('ROLE_SUPER_ADMIN');
    }

    public function manage_app_settings($account, $user): bool
    {
        return
            in_array(self::MANAGE_APP_SETTINGS, $account->getVoter()) && $user->isVerified() ||
            $this->security->isGranted('ROLE_SUPER_ADMIN');
    }

    public function manage_log($account, $user): bool
    {
        return
            in_array(self::MANAGE_LOG, $account->getVoter()) && $user->isVerified() ||
            $this->security->isGranted('ROLE_SUPER_ADMIN');
    }

    public function manage_email($account, $user): bool
    {
        return
            in_array(self::MANAGE_EMAIL, $account->getVoter()) && $user->isVerified() ||
            $this->security->isGranted('ROLE_SUPER_ADMIN');
    }

    public function send_email($account, $user): bool
    {
        return
            in_array(self::SEND_EMAIL, $account->getVoter()) && $user->isVerified() ||
            $this->security->isGranted('ROLE_SUPER_ADMIN');
    }

    public function manage_email_system($account, $user): bool
    {
        return
            in_array(self::MANAGE_EMAIL_SETTINGS, $account->getVoter()) && $user->isVerified() ||
            $this->security->isGranted('ROLE_SUPER_ADMIN');
    }

    public function medien_converter($account, $user): bool
    {
        return
            in_array(self::MEDIEN_CONVERTER, $account->getVoter()) && $user->isVerified() ||
            $this->security->isGranted('ROLE_SUPER_ADMIN');
    }

    public function account_email($account, $user): bool
    {
        return
            in_array(self::ACCOUNT_EMAIL, $account->getVoter()) && $user->isVerified() ||
            $this->security->isGranted('ROLE_SUPER_ADMIN');
    }

    public function manage_page($account, $user): bool
    {
        return
            in_array(self::MANAGE_PAGE, $account->getVoter()) && $user->isAdmin() ||
            $this->security->isGranted('ROLE_SUPER_ADMIN');
    }

    public function manage_page_seo($account, $user): bool
    {
        return
            in_array(self::MANAGE_PAGE_SEO, $account->getVoter()) && $user->isAdmin() ||
            $this->security->isGranted('ROLE_SUPER_ADMIN');
    }

    public function manage_page_sites($account, $user): bool
    {
        return
            in_array(self::MANAGE_PAGE_SITES, $account->getVoter()) && $user->isAdmin() ||
            $this->security->isGranted('ROLE_SUPER_ADMIN');
    }

    public function manage_page_category($account, $user): bool
    {
        return
            in_array(self::MANAGE_PAGE_CATEGORY, $account->getVoter()) && $user->isAdmin() ||
            $this->security->isGranted('ROLE_SUPER_ADMIN');
    }

    public function manage_site_builder($account, $user): bool
    {
        return
            in_array(self::MANAGE_SITE_BUILDER, $account->getVoter()) && $user->isAdmin() ||
            $this->security->isGranted('ROLE_SUPER_ADMIN');
    }

    public function manage_builder_sites($account, $user): bool
    {
        return
            in_array(self::MANAGE_BUILDER_SITES, $account->getVoter()) && $user->isAdmin() ||
            $this->security->isGranted('ROLE_SUPER_ADMIN');
    }

    public function manage_builder_plugins($account, $user): bool
    {
        return
            in_array(self::MANAGE_BUILDER_PLUGINS, $account->getVoter()) && $user->isAdmin() ||
            $this->security->isGranted('ROLE_SUPER_ADMIN');
    }

    public function medien_slider($account, $user): bool
    {
        return
            in_array(self::MEDIEN_SLIDER, $account->getVoter()) && $user->isAdmin() ||
            $this->security->isGranted('ROLE_SUPER_ADMIN');
    }

    public function medien_carousel($account, $user): bool
    {
        return
            in_array(self::MEDIEN_CAROUSEL, $account->getVoter()) && $user->isAdmin() ||
            $this->security->isGranted('ROLE_SUPER_ADMIN');
    }

    public function medien_gallery($account, $user): bool
    {
        return
            in_array(self::MEDIEN_GALLERY, $account->getVoter()) && $user->isAdmin() ||
            $this->security->isGranted('ROLE_SUPER_ADMIN');
    }

    public function manage_medien_gallery($account, $user): bool
    {
        return
            in_array(self::MANAGE_GALLERY_SLIDER, $account->getVoter()) && $user->isAdmin() ||
            $this->security->isGranted('ROLE_SUPER_ADMIN');
    }

    public function manage_menu($account, $user): bool
    {
        return
            in_array(self::MANAGE_MENU, $account->getVoter()) && $user->isAdmin() ||
            $this->security->isGranted('ROLE_SUPER_ADMIN');
    }

    public function add_menu($account, $user): bool
    {
        return
            in_array(self::ADD_MENU, $account->getVoter()) && $user->isAdmin() ||
            $this->security->isGranted('ROLE_SUPER_ADMIN');
    }

    public function manage_post($account, $user): bool
    {
        return
            in_array(self::MANAGE_POST, $account->getVoter()) && $user->isAdmin() ||
            $this->security->isGranted('ROLE_SUPER_ADMIN');
    }

    public function add_post($account, $user): bool
    {
        return
            in_array(self::ADD_POST, $account->getVoter()) && $user->isAdmin() ||
            $this->security->isGranted('ROLE_SUPER_ADMIN');
    }

    public function post_category_design($account, $user): bool
    {
        return
            in_array(self::POST_CATEGORY_DESIGN, $account->getVoter()) && $user->isAdmin() ||
            $this->security->isGranted('ROLE_SUPER_ADMIN');
    }

    public function post_design($account, $user): bool
    {
        return
            in_array(self::POST_DESIGN, $account->getVoter()) && $user->isAdmin() ||
            $this->security->isGranted('ROLE_SUPER_ADMIN');
    }

    public function post_loop_design($account, $user): bool
    {
        return
            in_array(self::POST_LOOP_DESIGN, $account->getVoter()) && $user->isAdmin() ||
            $this->security->isGranted('ROLE_SUPER_ADMIN');
    }

    public function delete_post($account, $user): bool
    {
        return
            in_array(self::DELETE_POST, $account->getVoter()) && $user->isAdmin() ||
            $this->security->isGranted('ROLE_SUPER_ADMIN');
    }

    public function delete_post_category($account, $user): bool
    {
        return
            in_array(self::DELETE_POST_CATEGORY, $account->getVoter()) && $user->isAdmin() ||
            $this->security->isGranted('ROLE_SUPER_ADMIN');
    }

    public function manage_scss_compiler($account, $user): bool
    {
        return
            in_array(self::MANAGE_SCSS_COMPILER, $account->getVoter()) && $user->isAdmin() ||
            $this->security->isGranted('ROLE_SUPER_ADMIN');
    }

    public function manage_fonts($account, $user): bool
    {
        return
            in_array(self::MANAGE_FONTS, $account->getVoter()) && $user->isAdmin() ||
            $this->security->isGranted('ROLE_SUPER_ADMIN');
    }

    public function delete_fonts($account, $user): bool
    {
        return
            in_array(self::DELETE_FONTS, $account->getVoter()) && $user->isAdmin() ||
            $this->security->isGranted('ROLE_SUPER_ADMIN');
    }

    public function manage_design($account, $user): bool
    {
        return
            in_array(self::MANAGE_DESIGN, $account->getVoter()) && $user->isAdmin() ||
            $this->security->isGranted('ROLE_SUPER_ADMIN');
    }
    public function manage_design_settings($account, $user): bool
    {
        return
            in_array(self::MANAGE_DESIGN_SETTINGS, $account->getVoter()) && $user->isAdmin() ||
            $this->security->isGranted('ROLE_SUPER_ADMIN');
    }
    public function manage_header($account, $user): bool
    {
        return
            in_array(self::MANAGE_HEADER, $account->getVoter()) && $user->isAdmin() ||
            $this->security->isGranted('ROLE_SUPER_ADMIN');
    }
    public function manage_footer($account, $user): bool
    {
        return
            in_array(self::MANAGE_FOOTER, $account->getVoter()) && $user->isAdmin() ||
            $this->security->isGranted('ROLE_SUPER_ADMIN');
    }
    public function manage_tools($account, $user): bool
    {
        return
            in_array(self::MANAGE_TOOLS, $account->getVoter()) && $user->isAdmin() ||
            $this->security->isGranted('ROLE_SUPER_ADMIN');
    }
    public function manage_maps_protection($account, $user): bool
    {
        return
            in_array(self::MANAGE_MAPS_PROTECTION, $account->getVoter()) && $user->isAdmin() ||
            $this->security->isGranted('ROLE_SUPER_ADMIN');
    }
    public function manage_forms($account, $user): bool
    {
        return
            in_array(self::MANAGE_FORMS, $account->getVoter()) && $user->isAdmin() ||
            $this->security->isGranted('ROLE_SUPER_ADMIN');
    }
    public function add_forms($account, $user): bool
    {
        return
            in_array(self::ADD_FORMS, $account->getVoter()) && $user->isAdmin() ||
            $this->security->isGranted('ROLE_SUPER_ADMIN');
    }
    public function delete_forms($account, $user): bool
    {
        return
            in_array(self::DELETE_FORMS, $account->getVoter()) && $user->isAdmin() ||
            $this->security->isGranted('ROLE_SUPER_ADMIN');
    }
    public function manage_consumer($account, $user): bool
    {
        return
            in_array(self::MANAGE_CONSUMER, $account->getVoter()) && $user->isAdmin() ||
            $this->security->isGranted('ROLE_SUPER_ADMIN');
    }
    public function manage_custom_fields($account, $user): bool
    {
        return
            in_array(self::MANAGE_CUSTOM_FIELDS, $account->getVoter()) && $user->isAdmin() ||
            $this->security->isGranted('ROLE_SUPER_ADMIN');
    }
}
