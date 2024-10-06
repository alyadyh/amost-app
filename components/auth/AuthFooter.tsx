import React from "react"
import { HStack } from "@/components/ui/hstack"
import { Text } from "@/components/ui/text"
import { LinkText } from "@/components/ui/link"
import Link from "@unitools/link"

interface AuthFooterProps {
  question: string
  linkText: string
  linkTo: string
}

const AuthFooter: React.FC<AuthFooterProps> = ({ question, linkText, linkTo }) => {
  return (
    <HStack className="self-center" space="sm">
      <Text size="md" className="text-amost-secondary-dark_2">
        {question}
      </Text>
      <Link href={linkTo}>
        <LinkText className="font-medium text-amost-primary no-underline" size="md">
          {linkText}
        </LinkText>
      </Link>
    </HStack>
  )
}

export default AuthFooter
