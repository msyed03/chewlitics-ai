import React, { useState } from 'react';
import PageContainer from '../components/ui/PageContainer';
import SectionHeader from '../components/ui/SectionHeader';
import AppCard from '../components/ui/AppCard';
import AppButton from '../components/ui/AppButton';
import { theme } from '../constants/theme';

const AICoach = () => {
    const [messages, setMessages] = useState([
        { id: 1, type: 'ai', text: 'Hi! I\'m your AI Coach. I\'m here to help you achieve your nutrition goals. What would you like to work on today?' },
    ]);
    const [inputValue, setInputValue] = useState('');

    const quickQuestions = [
        'How can I increase my protein intake?',
        'What should I eat before a workout?',
        'I\'m struggling with consistency',
        'Create a meal plan for this week',
    ];

    const tips = [
        {
            icon: '💪',
            title: 'Protein Power',
            desc: 'Aim for 25-30g protein per meal to maximize muscle synthesis and satiety.',
            priority: 'High',
            priorityColor: theme.colors.danger,
        },
        {
            icon: '🥗',
            title: 'Fiber First',
            desc: 'Start meals with vegetables for better digestion and blood sugar control.',
            priority: 'High',
            priorityColor: theme.colors.danger,
        },
        {
            icon: '⏰',
            title: 'Meal Timing',
            desc: 'Space your meals 4-5 hours apart to maintain steady energy levels.',
            priority: 'Medium',
            priorityColor: '#F59E0B',
        },
        {
            icon: '💧',
            title: 'Stay Hydrated',
            desc: 'Drink half your body weight in ounces of water daily.',
            priority: 'Medium',
            priorityColor: '#F59E0B',
        },
        {
            icon: '🏃',
            title: 'Post-Workout Fuel',
            desc: 'Consume protein and carbs within 30 mins after exercise for recovery.',
            priority: 'Medium',
            priorityColor: '#F59E0B',
        },
        {
            icon: '🎯',
            title: 'Track Progress',
            desc: 'Consistent tracking helps identify patterns and maintain accountability.',
            priority: 'Low',
            priorityColor: theme.colors.primary,
        },
    ];

    const handleSendMessage = () => {
        if (inputValue.trim()) {
            const userMessage = { id: messages.length + 1, type: 'user', text: inputValue };
            setMessages([...messages, userMessage]);

            // Simulate AI response
            setTimeout(() => {
                const aiResponses = [
                    'Great question! Here are my top recommendations for you...',
                    'I see! Let me provide some personalized advice based on your goals...',
                    'That\'s a common challenge. Here\'s what has worked for others...',
                    'Excellent! I can help you create a plan for that...',
                ];
                const aiMessage = {
                    id: messages.length + 2,
                    type: 'ai',
                    text: aiResponses[Math.floor(Math.random() * aiResponses.length)],
                };
                setMessages((prev) => [...prev, aiMessage]);
            }, 800);

            setInputValue('');
        }
    };

    const handleQuickQuestion = (question) => {
        const userMessage = { id: messages.length + 1, type: 'user', text: question };
        setMessages([...messages, userMessage]);

        setTimeout(() => {
            const aiMessage = {
                id: messages.length + 2,
                type: 'ai',
                text: 'Great question! Here\'s what I recommend for you based on your profile and goals...',
            };
            setMessages((prev) => [...prev, aiMessage]);
        }, 800);
    };

    return (
        <PageContainer>
            <SectionHeader
                title="AI Coach"
                subtitle="Get personalized nutrition guidance and coaching from your AI coach"
            />

            {/* Quick Tips */}
            <div style={{ marginBottom: theme.spacing.xxl }}>
                <SectionHeader title="Daily AI Tips" subtitle="Smart nutrition recommendations" />
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                    gap: theme.spacing.lg,
                }}>
                    {tips.map((tip, index) => (
                        <AppCard
                            key={index}
                            style={{
                                borderLeft: `4px solid ${tip.priorityColor}`,
                                cursor: 'pointer',
                                transition: 'all 200ms ease',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-4px)';
                                e.currentTarget.style.boxShadow = theme.shadows.card;
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        >
                            <div style={{ display: 'flex', gap: theme.spacing.md, marginBottom: theme.spacing.md }}>
                                <span style={{ fontSize: '32px' }}>{tip.icon}</span>
                                <div style={{ flex: 1 }}>
                                    <h4 style={{ ...theme.typography.body, fontWeight: 600, color: theme.colors.textPrimary, margin: 0, marginBottom: theme.spacing.xs }}>
                                        {tip.title}
                                    </h4>
                                    <div>
                                        <span style={{
                                            padding: '2px 8px',
                                            backgroundColor: tip.priorityColor + '20',
                                            color: tip.priorityColor,
                                            borderRadius: '4px',
                                            fontSize: '11px',
                                            fontWeight: 600,
                                        }}>
                                            {tip.priority}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <p style={{ ...theme.typography.small, color: theme.colors.textSecondary, margin: 0 }}>
                                {tip.desc}
                            </p>
                        </AppCard>
                    ))}
                </div>
            </div>

            {/* Chat Interface */}
            <AppCard style={{ display: 'flex', flexDirection: 'column', height: '500px', marginBottom: theme.spacing.xxl }}>
                <SectionHeader title="Chat with Your AI Coach" />

                {/* Messages Container */}
                <div style={{
                    flex: 1,
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: theme.spacing.md,
                    marginBottom: theme.spacing.lg,
                    paddingRight: theme.spacing.md,
                }}>
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            style={{
                                display: 'flex',
                                justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start',
                            }}
                        >
                            <div
                                style={{
                                    maxWidth: '70%',
                                    padding: theme.spacing.md,
                                    backgroundColor: message.type === 'user' ? theme.colors.primary : theme.colors.background,
                                    color: message.type === 'user' ? 'white' : theme.colors.textPrimary,
                                    borderRadius: theme.borderRadius.lg,
                                    borderBottomLeftRadius: message.type === 'user' ? theme.borderRadius.lg : theme.borderRadius.sm,
                                    borderBottomRightRadius: message.type === 'ai' ? theme.borderRadius.lg : theme.borderRadius.sm,
                                    ...theme.typography.body,
                                    wordWrap: 'break-word',
                                }}
                            >
                                {message.text}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Input Area */}
                <div style={{ display: 'flex', gap: theme.spacing.md }}>
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder="Ask me anything..."
                        style={{
                            flex: 1,
                            padding: theme.spacing.md,
                            border: `1px solid ${theme.colors.border}`,
                            borderRadius: theme.borderRadius.lg,
                            ...theme.typography.body,
                            fontFamily: 'inherit',
                        }}
                    />
                    <AppButton onClick={handleSendMessage} style={{ padding: `${theme.spacing.md} ${theme.spacing.lg}` }}>
                        Send
                    </AppButton>
                </div>
            </AppCard>

            {/* Quick Questions */}
            <AppCard>
                <SectionHeader title="Quick Questions" subtitle="Get instant answers" />
                <div style={{ display: 'grid', gap: theme.spacing.md }}>
                    {quickQuestions.map((question, index) => (
                        <AppButton
                            key={index}
                            variant="secondary"
                            onClick={() => handleQuickQuestion(question)}
                            style={{
                                textAlign: 'left',
                                padding: theme.spacing.lg,
                                justifyContent: 'flex-start',
                                transition: 'all 200ms ease',
                                cursor: 'pointer',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = theme.colors.primary;
                                e.currentTarget.style.color = 'white';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = theme.colors.background;
                                e.currentTarget.style.color = theme.colors.textPrimary;
                            }}
                        >
                            💬 {question}
                        </AppButton>
                    ))}
                </div>
            </AppCard>
        </PageContainer>
    );
};

export default AICoach;