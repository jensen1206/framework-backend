<?php

namespace App\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Validator\Constraints\NotBlank;
use Symfony\Contracts\Translation\TranslatorInterface;

class ResetPasswordRequestFormType extends AbstractType
{
    public function __construct(
        private readonly TranslatorInterface    $translator,
    )
    {
    }
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('email', EmailType::class, [

                'label' => $this->translator->trans('login.Email'),
                'label_attr' => [
                    'class' => 'ms-1'
                ],
                'constraints' => [
                    new NotBlank([
                        'message' => $this->translator->trans('register.Please enter your email'),
                    ]),
                ],
                'row_attr' => [
                    'class' => 'form-floating col-12'
                ],
                'attr' => [
                    'autocomplete'=> 'email',
                    'class' => 'no-blur',
                    'autofocus' => true,
                    'placeholder' => $this->translator->trans('login.Email'),
                ]
            ])
            ->add('sendButton', SubmitType::class, [
                'label' => '<i class="bi bi-reply me-2"></i>' . $this->translator->trans('register.Send password reset email'),
                'label_html' => true,
                'attr' => [
                    'class' => 'btn-secondary no-blur'
                ]
            ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'attr' => [
                'class' => 'row g-3'
            ]
        ]);
    }
}
