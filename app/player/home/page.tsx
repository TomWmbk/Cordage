import { redirect } from 'next/navigation'

export default function HiddenPlayerArea() {
    redirect('/login?role=stringer')
}
