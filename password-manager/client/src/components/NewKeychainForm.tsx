import { FormEvent, useEffect, useRef, useState } from 'react'
import { Header, FormGroup, PasswordStrength, SubmitButton } from '.'
import { useInput, useTimedCopyToClipboard } from '@/hooks'
import { TKeychain, TStatus } from '@/types'
import { GeneratePassword, GenerateUUID, GetLogoUrlAsync, Log, MergeRegExObj, RunAfterSomeTime } from '@/services/Utils/password-manager.helper'
import { REGISTER_STATE, KEYCHAIN_CONST } from '@/services/constants'

interface INewKeychainForm {
    showForm: (param: boolean) => void
}
export function NewKeychainForm({ showForm }: INewKeychainForm) {
    // form controlled inputs
    const { inputAttribute, inputAction } = useInput<TKeychain>({
        keychainId: '0',
        password: '',
        username: '',
        website: '',
        logo: '',
    })
    // destructure
    const { inputStates, onChange, onFocus, onBlur, isSubmitted } = inputAttribute
    const { website, username, password } = inputStates

    const [revealPassword, setRevealPassword] = useState(false)
    const [keychainStatus, setKeychainStatus] = useState<TStatus>({
        success: false,
        message: '',
    })
    const usernameClipboard = useTimedCopyToClipboard({
        message: 'User Name copied!',
        callbackFn: () => setKeychainStatus({ success: true, message: '' }),
    })
    const passwordClipboard = useTimedCopyToClipboard({
        message: 'Password copied!',
        callbackFn: () => setKeychainStatus({ success: true, message: '' }),
    })

    const websiteInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (!keychainStatus.success) websiteInputRef.current?.focus()

        // inputAction.mutate({ keychainId: GenerateUUID(), password: GeneratePassword() })

    }, [keychainStatus.success])

    const submitKeychainForm = async (e: FormEvent) => {
        e.preventDefault()

        if (!isSubmitted) {
            inputAction.submit(true)
            inputAction.mutate({
                keychainId: GenerateUUID(),
                logo: await GetLogoUrlAsync(website),
            })
            setKeychainStatus({ success: true, message: 'Password created!' })

            // simulate api call as a promise
            RunAfterSomeTime(() => {
                inputAction.submit(false)
                setKeychainStatus({ success: true, message: '' })
                inputAction.resetInput()
                inputAction.mutate({ password: GeneratePassword() })
            }, 3)
        }
    }

    return (
        <>
            <Header>
                <Header.Title
                    title="Add Password"
                    subTitle="We will save this password in your session storage and cloud account"
                />
                <Header.Status status={keychainStatus} />
            </Header>

            <FormGroup onSubmit={submitKeychainForm}>
                <div className="input-row">
                    <FormGroup.Label
                        props={{
                            label: 'Website',
                            labelFor: 'website',
                            isFulfilled: KEYCHAIN_CONST.WEBSITE_REGEX.test(website),
                        }}
                    />
                    <FormGroup.Input
                        id="website"
                        type="text"
                        linkRef={websiteInputRef}
                        placeholder="sample.com"
                        value={website}
                        required
                        {...{ onChange, onFocus, onBlur }}
                    />
                </div>

                <div className="input-row">
                    <FormGroup.Label
                        props={{
                            label: 'User Name',
                            labelFor: 'username',
                            isFulfilled: username.trim() ? true : false,
                        }}
                    />
                    <FormGroup.Input
                        id="username"
                        type="text"
                        placeholder="sample@email.com"
                        value={username}
                        required
                        {...{ onChange, onFocus, onBlur }}
                    />
                    <i
                        className={`fa fa-clone small action-button ${!usernameClipboard.isCopied && username && 'active'
                            }`}
                        style={{
                            position: 'absolute',
                            padding: '5px',
                            right: '8px',
                            bottom: '10px',
                            borderRadius: '20px',
                        }}
                        onClick={() => {
                            if (!usernameClipboard.isCopied) {
                                passwordClipboard.clear()
                                usernameClipboard.copy(username)
                                setKeychainStatus({ success: true, message: usernameClipboard.statusMessage })
                            }
                        }}
                    />
                </div>

                <div className="input-row vr">
                    <FormGroup.Label
                        props={{
                            label: 'Password',
                            labelFor: 'password',
                            isFulfilled: password.trim() ? true : false,
                        }}
                    >
                        <PasswordStrength
                            password={password}
                            regex={MergeRegExObj(REGISTER_STATE.PASSWORD_REGEX)}
                        />
                    </FormGroup.Label>
                    <div>
                        <FormGroup.Input
                            id="password"
                            style={{ paddingRight: '106px' }}
                            type={revealPassword ? 'text' : 'password'}
                            value={password}
                            disabled={false}
                            required
                            {...{ onChange, onFocus, onBlur }}
                        />

                        <div
                            style={{
                                position: 'absolute',
                                right: '5px',
                                top: '47px',
                                display: 'flex',
                                justifyContent: 'space-around',
                                width: '85px',
                            }}
                        >
                            <i
                                className={`fa fa-eye${revealPassword ? '-slash' : ''} small action-button ${password && 'active'
                                    }`}
                                style={{
                                    padding: '5px',
                                    borderRadius: '20px',
                                }}
                                onClick={() => setRevealPassword(prev => !prev)}
                            />
                            <i
                                className={`fa fa-refresh small action-button active`}
                                style={{
                                    padding: '5px',
                                    borderRadius: '20px',
                                }}
                                onClick={() => {
                                    passwordClipboard.clear()
                                    setRevealPassword(true)
                                    inputAction.mutate({ password: GeneratePassword() })
                                }}
                            />
                            <i
                                className={`fa fa-clone small action-button ${!passwordClipboard.isCopied && password && 'active'
                                    }`}
                                style={{
                                    padding: '5px',
                                    borderRadius: '20px',
                                }}
                                onClick={() => {
                                    if (!passwordClipboard.isCopied) {
                                        usernameClipboard.clear()
                                        passwordClipboard.copy(password)
                                        Log(passwordClipboard.statusMessage)
                                        setKeychainStatus({ success: true, message: passwordClipboard.statusMessage })
                                    }
                                }}
                            />
                        </div>
                        <p className="center small">
                            Adding the password here saves it only to your registered account. Make sure the
                            password you save here matches your password for the website.
                        </p>
                    </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                    <SubmitButton
                        variant="cancel"
                        submitted={false}
                        disabled={false}
                        onClick={() => {
                            setRevealPassword(false)
                            showForm(false)
                            setKeychainStatus({ success: false, message: '' })
                        }}
                    >
                        Cancel
                    </SubmitButton>

                    <SubmitButton
                        variant="primary"
                        submitted={isSubmitted}
                        disabled={
                            isSubmitted || !KEYCHAIN_CONST.WEBSITE_REGEX.test(website) || !username || !password
                        }
                    >
                        Save
                    </SubmitButton>
                </div>
            </FormGroup>
        </>
    )
}
