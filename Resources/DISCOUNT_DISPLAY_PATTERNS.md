# Discount Display Patterns Reference

This document provides reference patterns for displaying 3-Year Commit (3YC) discounts and Volume discounts in Adobe subscription interfaces.

## 3-Year Commit (3YC) Discount Display

### Visual Pattern
- **Original Price**: Strikethrough, dimmed/gray color
- **Discounted Price**: Bold, teal color (#0891b2)
- **Lightning Bolt Icon**: Green/teal colored icon next to price
- **Discount Label**: "3-year Commit pricing applied" in teal color (#0891b2)
- **Total Amount**: Dimmed text showing calculated total

### Example Implementation

```tsx
<Box>
  {/* Original Price - Strikethrough */}
  <Group gap={4} mb={4}>
    <Text size="xs" td="line-through" c="dimmed">
      $10.00 / User / year
    </Text>
  </Group>
  
  {/* Discounted Price with Icon and Label */}
  <Group gap={4} align="center">
    <Text size="xs" fw={600} c="#0891b2">
      $7.50 / User / year
    </Text>
    <IconBolt size={12} color="#0891b2" />
    <Text size="xs" c="#0891b2">
      3-year Commit pricing applied
    </Text>
  </Group>
  
  {/* Total */}
  <Text size="xs" c="dimmed" mt={4}>
    Total: $75.00
  </Text>
</Box>
```

### Visual Characteristics
- **Icon**: Lightning bolt (⚡) - represents 3YC commitment
- **Color Scheme**: Teal (#0891b2) - matches AppDirect primary color
- **Typography**: 
  - Original: Strikethrough, dimmed gray
  - Discounted: Bold, teal
  - Label: Regular, teal

---

## Volume Discount Display

### Visual Pattern
- **Original Price**: Strikethrough, dimmed/gray color
- **Discounted Price**: Bold, green color (#22c55e)
- **Badge**: Green "Volume" badge indicator
- **Discount Label**: "Volume pricing applied" in green color (#22c55e)
- **Total Amount**: Dimmed text showing calculated total

### Example Implementation

```tsx
<Box>
  {/* Original Price - Strikethrough */}
  <Group gap={4} mb={4}>
    <Text size="xs" td="line-through" c="dimmed">
      $100.00 / User / year
    </Text>
  </Group>
  
  {/* Discounted Price with Badge and Label */}
  <Group gap={4} align="center">
    <Text size="xs" fw={600} c="#22c55e">
      $85.00 / User / year
    </Text>
    <Badge size="xs" color="green" variant="light">
      Volume
    </Badge>
    <Text size="xs" c="#22c55e">
      Volume pricing applied
    </Text>
  </Group>
  
  {/* Total */}
  <Text size="xs" c="dimmed" mt={4}>
    Total: $850.00
  </Text>
</Box>
```

### Visual Characteristics
- **Badge**: Green "Volume" badge - indicates volume-based discount
- **Color Scheme**: Green (#22c55e) - represents volume/success
- **Typography**: 
  - Original: Strikethrough, dimmed gray
  - Discounted: Bold, green
  - Badge: Small, light green variant
  - Label: Regular, green

---

## Usage Guidelines

### When to Use 3YC Discount Display
- When subscription has a 3-Year Commit (3YC) commitment
- When the discount is applied due to multi-year contract
- Use teal color scheme (#0891b2) with lightning bolt icon

### When to Use Volume Discount Display
- When discount is based on quantity/volume purchased
- When subscription tier qualifies for volume pricing
- Use green color scheme (#22c55e) with "Volume" badge

### Common Layout Structure
1. **Container**: Box or Card with proper spacing
2. **Original Price**: Always show strikethrough original price first
3. **Spacing**: Small margin/gap between original and discounted
4. **Discounted Section**: Group containing price, icon/badge, and label
5. **Total**: Show calculated total below with dimmed text

### Accessibility Considerations
- Ensure sufficient color contrast for text
- Use semantic HTML where possible
- Include ARIA labels for icons when needed
- Maintain readable font sizes (minimum 12px)

---

## Color Reference

### 3YC Discount Colors
- **Primary Teal**: `#0891b2` (AppDirect primary color)
- **Text Dimmed**: `#6b7280` (Gray)
- **Lightning Bolt**: `#0891b2` (Same as primary)

### Volume Discount Colors
- **Primary Green**: `#22c55e` (Success/Volume green)
- **Text Dimmed**: `#6b7280` (Gray)
- **Badge Background**: Light green variant

---

## Component Dependencies

### Required Imports (Mantine UI)
```tsx
import { Box, Group, Text, Badge, Divider } from '@mantine/core';
import { IconBolt } from '@tabler/icons-react';
```

### Required Imports (Custom/Alternative)
```tsx
// If using custom icons
import IconBolt from './icons/IconBolt';
```

---

## Example: Full Product Card with 3YC Discount

```tsx
<Card shadow="xs" padding="md" radius="md" withBorder>
  <Group align="flex-start" mb="xs">
    <ThemeIcon color="blue" size={40} radius="md">
      <Text size="xs" fw={700} c="white">Dn</Text>
    </ThemeIcon>
    <Box style={{ flex: 1 }}>
      <Text fw={500} size="sm">3YC - RFS Dreamweaver</Text>
      <Text size="xs" c="dimmed">Adobe Developer</Text>
    </Box>
  </Group>
  
  <Divider my="xs" />
  
  <Text fw={500} size="sm" mb="xs">
    Annual Plan (EU English) Level 1
  </Text>
  
  <Text size="xs" c="dimmed" mb="md">
    Minimum contract duration is 1 year. Early cancellation charge of 100% will apply.
  </Text>
  
  <Group justify="space-between" mb="md">
    <Box>
      <Text size="sm" fw={500} mb="xs">Total Users</Text>
      <NumberInput value={10} size="sm" style={{ width: 100 }} />
    </Box>
    <Box style={{ textAlign: 'right' }}>
      {/* 3YC Discount Display */}
      <Group gap={4} mb={4} justify="flex-end">
        <Text size="xs" td="line-through" c="dimmed">
          $10.00 / User / year
        </Text>
      </Group>
      <Group gap={4} align="center" justify="flex-end">
        <Text size="sm" fw={600} c="#0891b2">
          $7.50 / User / year
        </Text>
        <IconBolt size={16} color="#0891b2" />
        <Text size="xs" c="#0891b2">
          3-year Commit pricing applied
        </Text>
      </Group>
    </Box>
  </Group>
</Card>
```

---

## Notes

- All Adobe subscriptions are **Co-Termed**, meaning they share the same Service End date as the original subscription
- Always display Service End date for new/restored subscriptions
- Pricing should always show both original (strikethrough) and discounted prices
- Use appropriate visual indicators (icon for 3YC, badge for Volume) to distinguish discount types
- Maintain consistency across all subscription interfaces

---

**Last Updated**: 2025-01-28  
**File Location**: `/Resources/DISCOUNT_DISPLAY_PATTERNS.md`  
**Related Components**: `MidTermUpgradesFlow.tsx`

