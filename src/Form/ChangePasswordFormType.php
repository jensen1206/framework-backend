<?php

namespace App\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use Symfony\Component\Form\Extension\Core\Type\RepeatedType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Validator\Constraints\Length;
use Symfony\Component\Validator\Constraints\NotBlank;
use Symfony\Contracts\Translation\TranslatorInterface;

class ChangePasswordFormType extends AbstractType
{
    public function __construct(
        private readonly TranslatorInterface    $translator,
    )
    {
    }
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('plainPassword', RepeatedType::class, [
                'type' => PasswordType::class,
                'options' => [
                    'attr' => [
                        'autocomplete' => 'new-password',
                        'placeholder' => $this->translator->trans('login.Password'),
                        'min' => 8,
                        'max' => 4096,
                        'class' => 'no-blur',
                        'autofocus' => true,
                        'minMessage' => $this->translator->trans('register.The password must be at least {{ limit }} characters long'),
                    ],
                ],
                'first_options' => [
                    'constraints' => [
                        new NotBlank([
                            'message' => $this->translator->trans('register.Please enter a password'),
                        ]),
                        new Length([
                            'min' => 6,
                            'minMessage' => $this->translator->trans('register.The password must be at least {{ limit }} characters long'),
                            // max length allowed by Symfony for security reasons
                            'max' => 4096,
                        ]),
                    ],
                    'label' => $this->translator->trans('register.New password'),
                    'label_html' => true,
                    'label_attr' => [
                        'class' => 'ms-1'
                    ],
                    'row_attr' => [
                        'class' => 'form-floating col-12'
                    ],
                ],
                'second_options' => [
                    'label' => $this->translator->trans('register.Repeat password'),
                    'label_html' => true,
                    'label_attr' => [
                        'class' => 'ms-1'
                    ],
                    'row_attr' => [
                        'class' => 'form-floating col-12 mb-2'
                    ],
                    'attr' => [
                        'class' => 'no-blur',
                        'placeholder' => $this->translator->trans('register.Repeat password'),
                        'autocomplete'=> 'new-password'
                    ],
                ],

                'invalid_message' => $this->translator->trans('register.The password fields must match.'),
                // Instead of being set onto the object directly,
                // this is read and encoded in the controller
                'mapped' => false,
            ])
            ->add('newPwBtn', SubmitType::class, [
                'label' => '<i class="bi bi-save2 me-2"></i>' . $this->translator->trans('register.Reset your password'),
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
                'class' => 'row g-2'
            ]
        ]);
    }
}
