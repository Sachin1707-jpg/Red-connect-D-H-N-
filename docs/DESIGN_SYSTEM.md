# 📐 Design System & Component Library - RedConnect

This document serves as the formal component specification for the RedConnect Design System, documenting reusable primitives, prop APIs, visual variants, usage examples, and accessibility requirements.

---

## 1. Component Directory Matrix

```
src/components/common/
├── Button/
├── Card/
├── Input/
├── Modal/
├── Badge/
├── Loader/
├── Toast/
├── Avatar/
├── Pagination/
├── SearchInput/
└── FilterSelect/
```

---

## 2. Component Specifications

### 2.1 `<Button />`

#### Purpose
Primary interactive trigger element for user commands, form submissions, and emergency action pledges.

#### Props API
| Prop | Type | Default | Options | Description |
|---|---|---|---|---|
| `variant` | string | `'primary'` | `'primary'`, `'emergency'`, `'secondary'`, `'outline'`, `'ghost'` | Visual style variant |
| `size` | string | `'md'` | `'sm'`, `'md'`, `'lg'` | Button dimensions and font size |
| `isLoading` | boolean | `false` | `true`, `false` | Displays spinner & disables interaction |
| `isDisabled` | boolean | `false` | `true`, `false` | Native disabled state |
| `leftIcon` | ReactNode | `null` | Lucide Icon | Icon rendered before label |
| `rightIcon` | ReactNode | `null` | Lucide Icon | Icon rendered after label |
| `children` | ReactNode | Required | String/Nodes | Button label content |

#### Code Usage Example
```jsx
import { Button } from '@/components/common/Button';
import { HeartHandshake } from 'lucide-react';

<Button 
  variant="emergency" 
  size="lg" 
  leftIcon={<HeartHandshake size={20} />}
  onClick={handlePledge}
>
  Pledge Immediate Donation
</Button>
```

#### Accessibility
- Emits native `<button>` element with `type="button"` or `type="submit"`.
- Applies `aria-busy="true"` and `disabled` attributes when `isLoading` is true.

---

### 2.2 `<Badge />`

#### Purpose
Visual indicator used for blood groups, urgency levels, request statuses, and user roles.

#### Props API
| Prop | Type | Default | Options | Description |
|---|---|---|---|---|
| `variant` | string | `'default'` | `'danger'`, `'warning'`, `'success'`, `'info'`, `'blood'` | Color theme |
| `size` | string | `'md'` | `'sm'`, `'md'` | Badge scale |
| `pulse` | boolean | `false` | `true`, `false` | Adds animated pulsing dot |

#### Code Usage Example
```jsx
<Badge variant="danger" pulse={true}>
  Critical Urgency
</Badge>
<Badge variant="blood">
  Group: O Negative
</Badge>
```

---

### 2.3 `<Card />`

#### Purpose
Structured surface container for content grouping, emergency request items, and dashboard metrics.

#### Props API
| Prop | Type | Default | Description |
|---|---|---|---|
| `hoverable` | boolean | `false` | Enables lift transition and box shadow expansion on hover |
| `bordered` | boolean | `true` | Adds light border boundary |
| `children` | ReactNode | Required | Card internal layout |

---

### 2.4 `<Input />`

#### Purpose
Text input control for forms, login credentials, and emergency details.

#### Props API
| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | string | `''` | Form field label text |
| `error` | string | `''` | Error message rendered below field |
| `leftIcon` | ReactNode | `null` | Leading icon inside field container |
| `helperText` | string | `''` | Secondary descriptive text |

---

### 2.5 `<Modal />`

#### Purpose
Focus-trapped overlay window for urgent actions, emergency creation forms, and pledge confirmation dialogs.

#### Props API
| Prop | Type | Default | Description |
|---|---|---|---|
| `isOpen` | boolean | Required | Controls modal visibility state |
| `onClose` | function | Required | Callback invoked on backdrop click or `Esc` press |
| `title` | string | Required | Header title text rendered inside modal |
| `children` | ReactNode | Required | Body content |

#### Accessibility Requirements
- Retains keyboard focus inside modal container via focus trap.
- Sets `role="dialog"`, `aria-modal="true"`, and `aria-labelledby` referencing modal title ID.
