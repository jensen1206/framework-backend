<?php

namespace App\Form;

use App\Entity\SystemSettings;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\EmailType;
use Symfony\Component\Form\Extension\Core\Type\PasswordType;
use Symfony\Component\Form\Extension\Core\Type\RepeatedType;
use Symfony\Component\Form\Extension\Core\Type\SubmitType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Validator\Constraints\Email;
use Symfony\Component\Validator\Constraints\IsTrue;
use Symfony\Component\Validator\Constraints\Length;
use Symfony\Component\Validator\Constraints\NotBlank;
use Symfony\Contracts\Translation\TranslatorInterface;

class RegistrationFormType extends AbstractType
{
    private array $register;

    public function __construct(
        private readonly TranslatorInterface    $translator,
        private readonly EntityManagerInterface $em,
    )
    {
        $settings = $this->em->getRepository(SystemSettings::class)->findOneBy(['designation' => 'system']);
        $this->register = $settings->getRegister();
    }

    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
       /* if ($this->register['show_company']) {
            $this->register['show_company'] == 1 ? $required = false : $required = true;
            $builder->add('company', TextType::class, [
                'required' => $required,
                'label_attr' => [
                    'class' => 'ms-1'
                ],
                'label' => $this->translator->trans('reg.Company/Organisation'),
                'label_html' => true,
                'row_attr' => [
                    'class' => 'form-floating col-12'
                ],
                'attr' => [
                    'autocomplete' => 'email',
                    'autofocus' => true,
                    'class' => 'no-blur',
                    'placeholder' => $this->translator->trans('reg.Company/Organisation'),
                ]
            ]);
        }*/
        $builder
            ->add('email', EmailType::class, [
                'constraints' => [new NotBlank(), new Email(
                    [
                        'message' => $this->translator->trans('register.The email {{ value }} is not a valid email address.'),
                        'mode' => 'strict',
                    ]
                )],
                'label_attr' => [
                    'class' => 'ms-1'
                ],
                'label' => $this->translator->trans('login.Email'),
                'label_html' => true,
                'row_attr' => [
                    'class' => 'form-floating col-12'
                ],
                'attr' => [
                    'autocomplete' => 'email',
                    'autofocus' => true,
                    'class' => 'no-blur',
                    'placeholder' => $this->translator->trans('login.Email'),
                ]
            ])
            ->add('agreeTerms', CheckboxType::class, [
                'mapped' => false,
                'label' => $this->translator->trans('register.Agree terms'),
                'constraints' => [
                    new IsTrue([
                        'message' => $this->translator->trans('register.You should agree to our terms.'),
                    ]),
                ],
            ])
            ->add('plainPassword', RepeatedType::class, [
                'type' => PasswordType::class,
                'mapped' => false,
                'required' => true,
                'constraints' => [new NotBlank(),
                    new Length([
                            'min' => 8,
                            'max' => 4096,
                            'minMessage' => $this->translator->trans('register.The password must be at least {{ limit }} characters long'),
                        ]
                    )],
                'first_options' => [
                    'label' => $this->translator->trans('login.Password') . ' <sup class="small-lg">(min 8)</sup>',
                    'label_html' => true,
                    'label_attr' => [
                        'class' => 'ms-1'
                    ],
                    'row_attr' => [
                        'class' => 'form-floating col-xl-6 col-12'
                    ],
                    'attr' => [
                        'class' => 'no-blur',
                        'placeholder' => $this->translator->trans('login.Password'),
                        'min' => 8,
                        'max' => 4096,
                        'autocomplete' => 'new-password'
                    ],
                ],
                'second_options' => [
                    'label' => $this->translator->trans('register.Repeat password') . ' <sup class="small-lg">(min 8)</sup>',
                    'label_html' => true,
                    'label_attr' => [
                        'class' => 'ms-1'
                    ],
                    'row_attr' => [
                        'class' => 'form-floating col-xl-6 col-12 mb-3'
                    ],
                    'attr' => [
                        'class' => 'no-blur',
                        'placeholder' => $this->translator->trans('register.Repeat password'),
                        'autocomplete' => 'new-password'
                    ],
                ],
            ])
            ->add('register_btn', SubmitType::class, [
                'label' => '<i class="bi bi-person-add me-2"></i>' . $this->translator->trans('register.Register'),
                'label_html' => true,
                'attr' => [
                    'class' => 'btn-secondary no-blur'
                ]
            ]);
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => User::class,
            'attr' => [
                'class' => 'row g-2'
            ]
        ]);
    }
}
