import { IsEmpty } from '@/utils'
import React, { MutableRefObject } from 'react'
import { Header } from './Header'
import { TKeychain } from '@/types'
import { AnimatedIcon } from '../AnimatedIcon'

export interface IVaultHeader {
    vault: TKeychain[]
    success: boolean
    message: string
    vaultCountRef: MutableRefObject<number>
}

export function VaultHeader({ vault, success, message, vaultCountRef }: IVaultHeader) {
    return (
        <Header>
            {!IsEmpty(vault) ? (
                <>
                    <Header.Logo />
                    <Header.Title title="Secured Vault" />
                    <div className="center">
                        <p className="small">{`${vaultCountRef.current} keychains save.`}</p>
                        <p className="x-small disabled">(0 leaked, 0 reused, 5 weak)</p>
                    </div>
                    <Header.Status status={{ success, message }} />
                </>
            ) : (
                <>
                    <Header.Logo>
                        <AnimatedIcon
                            className="danger"
                            iconName="fa fa-triangle-exclamation"
                            animation="fa-beat-fade"
                            animateOnLoad
                        />
                    </Header.Logo>
                    <Header.Title
                        title="This vault is empty..."
                        subTitle='click "+" to Add one'
                    />
                </>
            )}
        </Header>
    )
}
